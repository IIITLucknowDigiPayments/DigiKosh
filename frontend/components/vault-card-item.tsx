"use client";

import { VaultCard } from "./vault-card";
import { useBackendVaultData } from "@/hooks/use-vaults";
import { Address } from "viem";

interface VaultCardItemProps {
  vaultAddress: Address;
}

export function VaultCardItem({ vaultAddress }: VaultCardItemProps) {
  const { vaultData, isLoading } = useBackendVaultData(vaultAddress);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="h-8 bg-muted rounded w-1/4" />
      </div>
    );
  }

  if (!vaultData) {
    return null;
  }

  const vault = {
    id: vaultAddress,
    name: vaultData.name || "Unnamed Vault",
    description: vaultData.description || "No description",
    totalAssets: vaultData.totalAssets
      ? `$${Number(vaultData.totalAssets).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`
      : "$0",
    yieldAPY: "0%",
    monthlyYield: "$0",
    contributors: 0,
    status: "active" as const,
    deployer: vaultAddress.slice(0, 6) + "..." + vaultAddress.slice(-4),
  };

  return <VaultCard vault={vault} />;
}
