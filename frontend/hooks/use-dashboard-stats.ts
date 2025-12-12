"use client";

import { useReadContract, useContractReads } from "wagmi";
import {
  useVaultFactory,
  useContributorRegistry,
  useDistribution,
} from "./use-contracts";
import { useAllVaults } from "./use-vaults";
import VaultABI from "@/lib/abis/Vault.json";
import { useMemo } from "react";
import { formatEther, Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useDashboardStats() {
  const { vaults, vaultCount, isLoading: isLoadingVaults } = useAllVaults();
  const { address: factoryAddress, abi: factoryABI } = useVaultFactory();
  const { address: registryAddress, abi: registryABI } =
    useContributorRegistry();
  const { address: distributionAddress, abi: distributionABI } =
    useDistribution();

  // Read on-chain vault info for all known vaults using a batched read
  const contractCalls = (vaults || []).map((addr) => ({
    address: addr as any,
    abi: VaultABI.abi as any,
    functionName: "getVaultInfo" as const,
  }));

  const { data: onChainInfos } = useContractReads({
    contracts: contractCalls,
    enabled: !!vaults && vaults.length > 0,
    watch: true,
    query: { refetchInterval: 5000 },
  });

  // Sum on-chain total assets (on-chain only, no backend involvement)
  const totalAssets = useMemo(() => {
    if (!onChainInfos || onChainInfos.length === 0) return 0n;
    let sum = 0n;
    onChainInfos.forEach((info: any) => {
      if (!info) return;
      try {
        // info may be array or object depending on ABI
        const parsed = Array.isArray(info)
          ? BigInt(info[2] || 0)
          : BigInt(
              (info as any).totalAssetsValue || (info as any).totalAssets || 0
            );
        sum += parsed;
      } catch (e) {
        // ignore parse errors
      }
    });
    return sum;
  }, [onChainInfos]);

  // Fetch backend vault count (number of vault documents in DB)
  const { data: backendVaultsResp } = useQuery({
    queryKey: ["backend-vaults-count"],
    queryFn: async () => {
      return apiClient.getVaults();
    },
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // Backend vault count
  const backendVaultCount = useMemo(() => {
    if (!backendVaultsResp || !backendVaultsResp.success) return 0;
    return Array.isArray(backendVaultsResp.data)
      ? backendVaultsResp.data.length
      : 0;
  }, [backendVaultsResp]);

  // Fetch all contributors from backend (direct count of contributor documents)
  const { data: allApiContributors } = useQuery({
    queryKey: ["all-contributors"],
    queryFn: async () => {
      // Call getAllContributors endpoint to get all contributors count
      try {
        return await apiClient.getContributors();
      } catch {
        return { success: false, data: [] };
      }
    },
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // Calculate contributor count from backend document count
  const contributorCount = useMemo(() => {
    if (!allApiContributors || !allApiContributors.success) return 0;
    return Array.isArray(allApiContributors.data)
      ? allApiContributors.data.length
      : 0;
  }, [allApiContributors]);

  // Fetch recent (executed) distributions from backend and sum totalAmount
  const { data: recentDistributionsResp } = useQuery({
    queryKey: ["recent-distributions"],
    queryFn: async () => {
      return apiClient.getRecentDistributions();
    },
    staleTime: 5000,
    refetchInterval: 15000,
  });

  // Yield earned: backend only (sum of totalAmount from recent distributions)
  const yieldEarned = useMemo(() => {
    if (!recentDistributionsResp || !recentDistributionsResp.success) return 0n;
    let sum = 0n;
    recentDistributionsResp.data.forEach((d: any) => {
      try {
        if (d && d.totalAmount) sum += BigInt(d.totalAmount);
      } catch (e) {}
    });
    return sum;
  }, [recentDistributionsResp]);

  return {
    totalAssets: formatEther(totalAssets),
    vaultCount: backendVaultCount,
    contributorCount,
    yieldEarned: formatEther(yieldEarned),
    avgAPY: "0", // Would need to calculate from yield
    isLoading: isLoadingVaults,
  };
}
