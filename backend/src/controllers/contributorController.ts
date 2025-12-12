import { Request, Response } from "express";
import { Contributor } from "../models/Contributor";
import { Vault } from "../models/Vault";
import { contractService } from "../services/contractService";

export class ContributorController {
  async getVaultContributors(req: Request, res: Response) {
    try {
      const { vaultAddress } = req.params;
      let contributors = await Contributor.find({
        vault: vaultAddress,
        isActive: true,
      });

      // If not in DB, fetch from contract
      if (contributors.length === 0) {
        const contributorAddresses = await contractService.getVaultContributors(
          vaultAddress
        );
        for (const address of contributorAddresses) {
          const contributorInfo = await contractService.getContributor(
            vaultAddress,
            address
          );
          const contributor = await Contributor.create({
            vault: vaultAddress,
            wallet: address,
            ...contributorInfo,
          });
          contributors.push(contributor);
        }
      }

      console.log(
        `Fetched ${contributors.length} contributors for vault ${vaultAddress}`
      );
      console.log("Contributors:", contributors);
      res.json({ success: true, data: contributors });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAllContributors(req: Request, res: Response) {
    try {
      const contributors = await Contributor.find({ isActive: true }).sort({
        createdAt: -1,
      });
      res.json({ success: true, data: contributors });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createContributor(req: Request, res: Response) {
    console.log("Received request to create contributor:", req.body);
    try {
      const {
        vault,
        wallet,
        name,
        role,
        monthlyAllocation,
        totalEarned,
        isActive,
      } = req.body;

      // Basic validation
      if (!vault || !wallet || !name || !role) {
        return res
          .status(400)
          .json({
            success: false,
            error: "vault, wallet, name and role are required",
          });
      }

      const contributor = await Contributor.findOneAndUpdate(
        { vault, wallet },
        {
          vault,
          wallet,
          name,
          role,
          monthlyAllocation: monthlyAllocation ?? "0",
          totalEarned: totalEarned ?? "0",
          isActive: typeof isActive === "boolean" ? isActive : true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Check if this was an update or create
      const wasUpdate = contributor.createdAt && contributor.updatedAt && 
                       contributor.createdAt.getTime() !== contributor.updatedAt.getTime();
      console.log(`Contributor ${wasUpdate ? 'UPDATED' : 'CREATED'} successfully:`, {
        wallet: contributor.wallet,
        vault: contributor.vault,
        monthlyAllocation: contributor.monthlyAllocation,
        isActive: contributor.isActive
      });

      // Update vault stats: recalculate totalAssets as sum of all contributors' monthly allocations
      // IMPORTANT: Always recalculate from scratch to handle both create and update cases
      // This ensures that when a contributor's allocation is updated, the vault totalAssets is recalculated correctly
      try {
        const vaultDoc = await Vault.findOne({ address: vault });
        if (!vaultDoc) {
          console.warn(`[ContributorController] Vault ${vault} not found, skipping totalAssets update`);
        } else {
          // Get all active contributors for this vault
          // Query fresh from database to ensure we have the latest values (especially after update)
          const allContributors = await Contributor.find({
            vault: vault,
            isActive: true,
          });
          
          console.log(`[ContributorController] Recalculating totalAssets for vault ${vault}`);
          console.log(`[ContributorController] Found ${allContributors.length} active contributors`);

          // Calculate totalAssets as sum of all contributors' monthly allocations ONLY
          // Contributors' monthlyAllocation is in wei (18 decimals)
          // Convert to base unit (6 decimals for USDC) by dividing by 10^12
          let totalAssetsSumWei = 0n;
          let contributorCount = 0;
          
          for (const contrib of allContributors) {
            // Check isActive - it's in the query but double-check
            const isContribActive = contrib.isActive !== false; // Default to true if not set
            if (isContribActive && contrib.monthlyAllocation) {
              try {
                const allocationStr = String(contrib.monthlyAllocation || "0").trim();
                if (allocationStr && allocationStr !== "0") {
                  const allocation = BigInt(allocationStr);
                  console.log(`[ContributorController] Contributor ${contrib.wallet}: monthlyAllocation (wei) = ${allocation.toString()}`);
                  totalAssetsSumWei += allocation;
                  contributorCount++;
                }
              } catch (e) {
                console.error(`Error parsing monthlyAllocation for contributor ${contrib.wallet}:`, e);
              }
            }
          }

          console.log(`[ContributorController] Total sum (wei): ${totalAssetsSumWei.toString()}`);

          // Convert from wei (18 decimals) to base unit (6 decimals for USDC)
          // Divide by 10^12 to convert 18 decimals to 6 decimals
          const CONVERSION_FACTOR = 1000000000000n; // 10^12
          const totalAssetsBaseUnit = totalAssetsSumWei / CONVERSION_FACTOR;

          console.log(`[ContributorController] Total assets (base unit, 6 decimals): ${totalAssetsBaseUnit.toString()}`);

          // Update vault with sum of contributors' monthly allocations in base unit (6 decimals)
          vaultDoc.totalAssets = totalAssetsBaseUnit.toString();
          vaultDoc.contributorCount = contributorCount;

          // Calculate monthly yield as 0.19% of totalAssets
          // totalAssets is in base unit (6 decimals), so yield will also be in base unit (6 decimals)
          try {
            const assets = BigInt(vaultDoc.totalAssets || "0");
            // 0.19% = 19/10000
            // Multiply by 19, then divide by 10000
            const yield019percent = (assets * BigInt(19)) / BigInt(10000);
            vaultDoc.monthlyYield = yield019percent.toString();
            console.log(`[ContributorController] Monthly yield (0.19% of ${assets.toString()}): ${yield019percent.toString()}`);
          } catch (e) {
            console.error("Error calculating monthlyYield:", e);
            vaultDoc.monthlyYield = "0";
          }

          await vaultDoc.save();
          console.log(`Vault stats updated - totalAssets (sum of contributors): ${vaultDoc.totalAssets}, contributors: ${contributorCount}`);
        }
      } catch (error: any) {
        console.error("Error updating vault stats:", error.message);
        // Don't fail the contributor creation if vault update fails
      }

      return res.status(201).json({ success: true, data: contributor });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const contributorController = new ContributorController();
