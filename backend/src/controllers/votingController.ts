import { Request, Response } from "express";
import { Voting } from "../models/Voting";
import { contractService } from "../services/contractService";
import { ethers } from "ethers";
import { CONTRACTS } from "../config/contracts";

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://sepolia.base.org"
);

export class VotingController {
  async getAllVotings(req: Request, res: Response) {
    try {
      const votings = await Voting.find().sort({ createdAt: -1 });
      res.json({ success: true, data: votings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getVotingById(req: Request, res: Response) {
    try {
      const { votingId } = req.params;
      let voting = await Voting.findOne({ votingId: Number(votingId) });

      // If not in DB, fetch from contract
      if (!voting) {
        const quadraticVoting = new ethers.Contract(
          CONTRACTS.QUADRATIC_VOTING,
          [
            "function votings(uint256) view returns (address vault, address nominee, string memory nomineeName, string memory role, string memory description, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, bool isActive, bool isApproved)",
          ],
          provider
        );
        const votingData = await quadraticVoting.votings(votingId);
        voting = await Voting.create({
          votingId: Number(votingId),
          vault: votingData.vault,
          nominee: votingData.nominee,
          nomineeName: votingData.nomineeName,
          description: votingData.description,
          startTime: new Date(Number(votingData.startTime) * 1000),
          endTime: new Date(Number(votingData.endTime) * 1000),
          votesFor: Number(votingData.votesFor),
          votesAgainst: Number(votingData.votesAgainst),
          totalVotes: Number(votingData.totalVotes),
          isActive: votingData.isActive,
          isApproved: votingData.isApproved,
        });
      }

      res.json({ success: true, data: voting });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getActiveVotings(req: Request, res: Response) {
    try {
      const now = new Date();
      const votings = await Voting.find({
        isActive: true,
        endTime: { $gt: now },
      }).sort({ endTime: 1 });
      res.json({ success: true, data: votings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPastVotings(req: Request, res: Response) {
    try {
      const now = new Date();
      const votings = await Voting.find({
        $or: [{ isActive: false }, { endTime: { $lte: now } }],
      }).sort({ endTime: -1 });
      res.json({ success: true, data: votings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async syncVotings(req: Request, res: Response) {
    try {
      const quadraticVoting = new ethers.Contract(
        CONTRACTS.QUADRATIC_VOTING,
        [
          "function getAllVotingIds() view returns (uint256[] memory ids)",
          "function votings(uint256) view returns (address vault, address nominee, string memory nomineeName, string memory role, string memory description, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, bool isActive, bool isApproved)",
        ],
        provider
      );
      const votingIds = await quadraticVoting.getAllVotingIds();

      const syncedVotings = [];
      for (const votingId of votingIds) {
        const existing = await Voting.findOne({ votingId: Number(votingId) });
        if (!existing) {
          const votingData = await quadraticVoting.votings(votingId);
          const voting = await Voting.create({
            votingId: Number(votingId),
            vault: votingData.vault,
            nominee: votingData.nominee,
            nomineeName: votingData.nomineeName,
            description: votingData.description,
            startTime: new Date(Number(votingData.startTime) * 1000),
            endTime: new Date(Number(votingData.endTime) * 1000),
            votesFor: Number(votingData.votesFor),
            votesAgainst: Number(votingData.votesAgainst),
            totalVotes: Number(votingData.totalVotes),
            isActive: votingData.isActive,
            isApproved: votingData.isApproved,
          });
          syncedVotings.push(voting);
        }
      }

      res.json({
        success: true,
        data: syncedVotings,
        message: `Synced ${syncedVotings.length} votings`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createVoting(req: Request, res: Response) {
    try {
      const {
        votingId,
        vault,
        nominee,
        nomineeName,
        description,
        startTime,
        endTime,
      } = req.body;

      if (!vault || !nominee || !nomineeName || !description) {
        return res.status(400).json({
          success: false,
          error: "vault, nominee, nomineeName and description are required",
        });
      }

      // Use provided votingId or generate a pseudo-unique id using timestamp
      const id = votingId ? Number(votingId) : Date.now();

      const existing = await Voting.findOne({ votingId: id });
      if (existing) {
        return res.status(200).json({
          success: true,
          data: existing,
          message: "Voting already exists",
        });
      }

      const voting = await Voting.create({
        votingId: id,
        vault,
        nominee,
        nomineeName,
        description,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime
          ? new Date(endTime)
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        isActive: true,
        isApproved: null,
      });

      return res.status(201).json({ success: true, data: voting });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async recordVote(req: Request, res: Response) {
    try {
      const { votingId } = req.params;
      const { votesFor, votesAgainst } = req.body;

      console.log("[recordVote] Request received:", {
        votingId,
        votesFor,
        votesAgainst,
        timestamp: new Date().toISOString(),
      });

      if (votesFor === undefined || votesAgainst === undefined) {
        console.log(
          "[recordVote] Missing votesFor or votesAgainst in request body"
        );
        return res.status(400).json({
          success: false,
          error: "votesFor and votesAgainst are required",
        });
      }

      let voting = await Voting.findOne({ votingId: Number(votingId) });
      console.log("[recordVote] Voting found in DB:", !!voting);

      // If voting not present in DB, try to fetch from contract and create
      if (!voting) {
        console.log("[recordVote] Voting not in DB, fetching from contract...");
        try {
          const quadraticVoting = new ethers.Contract(
            CONTRACTS.QUADRATIC_VOTING,
            [
              "function votings(uint256) view returns (address vault, address nominee, string memory nomineeName, string memory role, string memory description, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, bool isActive, bool isApproved)",
            ],
            provider
          );
          const votingData = await quadraticVoting.votings(votingId);
          console.log("[recordVote] Fetched from contract:", {
            votesFor: votingData.votesFor,
            votesAgainst: votingData.votesAgainst,
          });
          voting = await Voting.create({
            votingId: Number(votingId),
            vault: votingData.vault,
            nominee: votingData.nominee,
            nomineeName: votingData.nomineeName,
            description: votingData.description,
            startTime: new Date(Number(votingData.startTime) * 1000),
            endTime: new Date(Number(votingData.endTime) * 1000),
            votesFor: Number(votingData.votesFor),
            votesAgainst: Number(votingData.votesAgainst),
            totalVotes: Number(votingData.totalVotes),
            isActive: votingData.isActive,
            isApproved: votingData.isApproved,
          });
          console.log("[recordVote] Created voting from contract data");
        } catch (err) {
          console.error("[recordVote] Error fetching from contract:", err);
          return res
            .status(404)
            .json({ success: false, error: "Voting not found" });
        }
      }

      // Update vote counts
      console.log("[recordVote] Updating vote counts from", {
        old: { votesFor: voting.votesFor, votesAgainst: voting.votesAgainst },
        new: { votesFor, votesAgainst },
      });

      voting.votesFor = Number(votesFor);
      voting.votesAgainst = Number(votesAgainst);
      voting.totalVotes = Number(votesFor) + Number(votesAgainst);
      voting.updatedAt = new Date();

      await voting.save();
      console.log("[recordVote] Voting saved successfully:", {
        votingId: voting.votingId,
        votesFor: voting.votesFor,
        votesAgainst: voting.votesAgainst,
        totalVotes: voting.totalVotes,
      });

      return res.json({ success: true, data: voting });
    } catch (error: any) {
      console.error("[recordVote] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async incrementVote(req: Request, res: Response) {
    try {
      const { votingId } = req.params;
      const { deltaFor = 0, deltaAgainst = 0 } = req.body;

      console.log("[incrementVote] Request:", {
        votingId,
        deltaFor,
        deltaAgainst,
      });

      let voting = await Voting.findOne({ votingId: Number(votingId) });

      // If voting not present in DB, try to fetch from contract and create
      if (!voting) {
        try {
          const quadraticVoting = new ethers.Contract(
            CONTRACTS.QUADRATIC_VOTING,
            [
              "function votings(uint256) view returns (address vault, address nominee, string memory nomineeName, string memory role, string memory description, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, bool isActive, bool isApproved)",
            ],
            provider
          );
          const votingData = await quadraticVoting.votings(votingId);
          voting = await Voting.create({
            votingId: Number(votingId),
            vault: votingData.vault,
            nominee: votingData.nominee,
            nomineeName: votingData.nomineeName,
            description: votingData.description,
            startTime: new Date(Number(votingData.startTime) * 1000),
            endTime: new Date(Number(votingData.endTime) * 1000),
            votesFor: Number(votingData.votesFor),
            votesAgainst: Number(votingData.votesAgainst),
            totalVotes: Number(votingData.totalVotes),
            isActive: votingData.isActive,
            isApproved: votingData.isApproved,
          });
        } catch (err) {
          console.error("[incrementVote] Error fetching from contract:", err);
          return res
            .status(404)
            .json({ success: false, error: "Voting not found" });
        }
      }

      // Apply deltas
      voting.votesFor = Number(voting.votesFor) + Number(deltaFor);
      voting.votesAgainst = Number(voting.votesAgainst) + Number(deltaAgainst);
      voting.totalVotes = Number(voting.votesFor) + Number(voting.votesAgainst);
      voting.updatedAt = new Date();

      await voting.save();

      console.log("[incrementVote] Updated voting:", {
        votingId: voting.votingId,
        votesFor: voting.votesFor,
        votesAgainst: voting.votesAgainst,
        totalVotes: voting.totalVotes,
      });

      return res.json({ success: true, data: voting });
    } catch (error: any) {
      console.error("[incrementVote] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const votingController = new VotingController();
