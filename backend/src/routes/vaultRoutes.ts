import { Router } from "express";
import { vaultController } from "../controllers/vaultController";

export const vaultRoutes = Router();

vaultRoutes.get("/", (req, res) => vaultController.getAllVaults(req, res));
vaultRoutes.get("/sync", (req, res) => vaultController.syncVaults(req, res));
vaultRoutes.get("/addresses", (req, res) =>
  vaultController.getVaultAddresses(req, res)
);
vaultRoutes.post("/", (req, res) => vaultController.createVault(req, res));
vaultRoutes.put("/:address", (req, res) =>
  vaultController.updateVaultStats(req, res)
);
vaultRoutes.get("/:address", (req, res) =>
  vaultController.getVaultById(req, res)
);
