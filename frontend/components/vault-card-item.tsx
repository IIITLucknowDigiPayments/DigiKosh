"use client";

import { VaultCard } from "./vault-card";
import { useBackendVaultData } from "@/hooks/use-vaults";
import { Address } from "viem";
import { formatUnits } from "viem";

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

  // totalAssets from backend is in base unit (6 decimals for USDC)
  // Convert from string to BigInt, then format with 6 decimals
  const totalAssetsBigInt = vaultData.totalAssets
    ? BigInt(vaultData.totalAssets || "0")
    : 0n;
  
  // Format with 6 decimals (USDC standard)
  const totalAssetsFormatted = formatUnits(totalAssetsBigInt, 6);
  const totalAssetsNumber = Number(totalAssetsFormatted);

  // Calculate monthly yield as 0.19% of total assets
  const monthlyYieldNumber = totalAssetsNumber * 0.0019; // 0.19%
  const monthlyYieldFormatted = `$${monthlyYieldNumber.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
  const myPercent = totalAssetsNumber > 0 ? (monthlyYieldNumber / totalAssetsNumber) * 100 : 0;
  const apyPercent = myPercent > 0 ? (Math.pow((100 + myPercent) / 100, 12) - 1) * 100 : 0;
  const apyFormatted = apyPercent.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const vault = {
    id: vaultAddress,
    name: vaultData.name || "Unnamed Vault",
    description: vaultData.description || "No description",
    totalAssets: totalAssetsNumber > 0
      ? `$${totalAssetsNumber.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`
      : "$0",
    yieldAPY: `${apyFormatted}%`,
    monthlyYield: monthlyYieldFormatted,
    contributors: vaultData.contributorCount || 0,
    status: "active" as const,
    deployer: vaultAddress.slice(0, 6) + "..." + vaultAddress.slice(-4),
  };

  return <VaultCard vault={vault} />;
}
