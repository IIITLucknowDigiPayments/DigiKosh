import { Request, Response } from "express";
import { Vault } from "../models/Vault";
import { contractService } from "../services/contractService";

export class VaultController {
  async getAllVaults(req: Request, res: Response) {
    try {
      const vaults = await Vault.find().sort({ createdAt: -1 });
      res.json({ success: true, data: vaults });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getVaultById(req: Request, res: Response) {
    try {
      const { address } = req.params;

      // Validate address format
      if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid vault address format" });
      }

      let vault = await Vault.findOne({ address });

      // If not in DB, create fake vault data (for demo purposes)
      if (!vault) {
        console.log(
          `[getVaultById] Vault not found, creating fake data for ${address}`
        );

        // Create fake vault with dummy data
        vault = await Vault.create({
          address,
          name: `Vault ${address.slice(0, 6)}...${address.slice(-4)}`,
          description: `Auto-generated vault for address ${address}`,
          asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          deployer: "0x0000000000000000000000000000000000000000",
          totalAssets: "0",
          totalSupply: "0",
        });

        console.log(`[getVaultById] Created fake vault:`, vault);
      }

      res.json({ success: true, data: vault });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async syncVaults(req: Request, res: Response) {
    try {
      const vaultAddresses = await contractService.getAllVaults();
      const syncedVaults = [];
      const updatedVaults = [];
      const errors: string[] = [];

      for (const address of vaultAddresses) {
        try {
          const existing = await Vault.findOne({ address });
          const vaultInfo = await contractService.getVaultInfo(address);

          if (existing) {
            // Update existing vault
            existing.name = vaultInfo.name;
            existing.description = vaultInfo.description;
            existing.totalAssets = vaultInfo.totalAssets;
            existing.totalSupply = vaultInfo.totalSupply;
            existing.asset = vaultInfo.asset;
            existing.deployer = vaultInfo.deployer;
            await existing.save();
            updatedVaults.push(existing);
          } else {
            // Create new vault
            const vault = await Vault.create({
              address,
              ...vaultInfo,
            });
            syncedVaults.push(vault);
          }
        } catch (error: any) {
          // Check if it's an invalid vault (doesn't implement getVaultInfo)
          const isInvalidVault = error.message?.includes(
            "does not implement getVaultInfo"
          );
          const errorMessage = isInvalidVault
            ? `Vault ${address} does not implement getVaultInfo() - skipping`
            : `Failed to sync vault ${address}: ${error.message}`;

          errors.push(errorMessage);
        }
      }

      res.json({
        success: true,
        data: syncedVaults,
        updated: updatedVaults,
        message: `Synced ${syncedVaults.length} new vault(s), updated ${updatedVaults.length} existing vault(s)`,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getVaultAddresses(req: Request, res: Response) {
    try {
      const vaultAddresses = await contractService.getAllVaults();
      res.json({
        success: true,
        data: vaultAddresses,
        count: vaultAddresses.length,
        message:
          vaultAddresses.length === 0
            ? "No vaults deployed yet. Use VaultFactory or SparkVaultFactory to create vaults."
            : `Found ${vaultAddresses.length} vault(s)`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createVault(req: Request, res: Response) {
    try {
      const {
        address,
        name,
        description,
        asset,
        deployer,
        totalAssets,
        totalSupply,
      } = req.body;

      if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid or missing vault address" });
      }

      if (!name || !description) {
        return res
          .status(400)
          .json({ success: false, error: "Name and description are required" });
      }

      const existing = await Vault.findOne({ address });
      if (existing) {
        return res.status(200).json({
          success: true,
          data: existing,
          message: "Vault already exists",
        });
      }

      const vault = await Vault.create({
        address,
        name,
        description,
        asset: asset || "0x0000000000000000000000000000000000000000",
        deployer: deployer || "0x0000000000000000000000000000000000000000",
        totalAssets: totalAssets || "0",
        totalSupply: totalSupply || "0",
      });

      return res.status(201).json({ success: true, data: vault });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const vaultController = new VaultController();
