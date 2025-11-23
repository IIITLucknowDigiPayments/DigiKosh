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

      // If not in DB, try to fetch from contract
      if (!vault) {
        try {
          const vaultInfo = await contractService.getVaultInfo(address);
          vault = await Vault.create({
            address,
            ...vaultInfo,
          });
        } catch (contractError: any) {
          // If contract call fails, return error with helpful message
          // Check if this is one of our known contract addresses
          const knownContracts = {
            "0xa80321F56d50E343616f36f670Ed0800b6d8A321": "ContributorRegistry",
            "0x663FBd2ad9cee79f7906FB215e87EEF06dA6651C": "QuadraticVoting",
            "0x80042e38b561B8273392737057Bd9bE56D155b43": "Distribution",
            "0x1cC3782B53B588a7687eA3B49A89B270E0fD644e": "VaultFactory",
            "0xc388aA6B259116D519eCe980eEB1AE2eBC3Fa605": "SparkVaultFactory",
          };

          const contractName =
            knownContracts[address as keyof typeof knownContracts];

          return res.status(404).json({
            success: false,
            error: contractName
              ? `Address ${address} is the ${contractName} contract, not a vault. Use /api/v1/vaults/sync to get valid vault addresses.`
              : `Vault not found at address ${address}. It may not be deployed or may not be a valid vault contract. Use /api/v1/vaults/sync to get valid vault addresses.`,
            details: contractError.message,
            hint: "Try calling GET /api/v1/vaults/sync first to sync and get all valid vault addresses",
          });
        }
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
}

export const vaultController = new VaultController();
