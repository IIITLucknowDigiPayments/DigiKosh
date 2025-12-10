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

  // Sum on-chain total assets (prefer on-chain when available)
  const onChainTotal = useMemo(() => {
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

  // Fetch backend vaults and compute backend totals
  const { data: backendVaultsResp } = apiClient
    ? useQuery({
        queryKey: ["backend-vaults"],
        queryFn: async () => {
          const res = await apiClient.getVaults();
          return res;
        },
        staleTime: 5000,
        refetchInterval: 10000,
      })
    : { data: null };

  const backendTotal = useMemo(() => {
    if (!backendVaultsResp || !backendVaultsResp.success) return 0;
    let sum = 0n;
    backendVaultsResp.data.forEach((v: any) => {
      const ta = v?.totalAssets;
      if (ta) {
        try {
          // assume stored as string in wei
          sum += BigInt(ta);
        } catch (e) {
          // fallback parse float dollars -> wei assumed not used
        }
      }
    });
    return sum;
  }, [backendVaultsResp]);

  // Combine totals by preferring on-chain values when present; otherwise use backend
  const totalAssets = useMemo(() => {
    // If on-chain total available, use it; otherwise fall back to backend total
    if (onChainTotal && onChainTotal > 0n) return onChainTotal;
    return backendTotal;
  }, [onChainTotal, backendTotal]);

  // Fetch contributors from API for all vaults
  const { data: allApiContributors } = useQuery({
    queryKey: ["all-contributors", vaults],
    queryFn: async () => {
      if (!vaults || vaults.length === 0) return [];

      const promises = vaults.map((vaultAddress) =>
        apiClient
          .getVaultContributors(vaultAddress)
          .catch(() => ({ success: false, data: [] }))
      );
      return Promise.all(promises);
    },
    enabled: !!vaults && vaults.length > 0,
    staleTime: 0,
    refetchInterval: 10000,
  });

  // Calculate contributor count from API data
  const contributorCount = useMemo(() => {
    if (!allApiContributors || allApiContributors.length === 0) {
      // If API data is not available, try to get from contract for first vault as fallback
      return 0;
    }

    const uniqueContributors = new Set<string>();

    allApiContributors.forEach((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        response.data.forEach((contributor: any) => {
          if (contributor.wallet && contributor.isActive !== false) {
            uniqueContributors.add(contributor.wallet.toLowerCase());
          }
        });
      }
    });

    return uniqueContributors.size;
  }, [allApiContributors]);

  // Get total contributors count
  const { data: allScheduleIds } = useReadContract({
    address: distributionAddress,
    abi: distributionABI,
    functionName: "getAllScheduleIds",
  });

  // Fetch recent (executed) distributions from backend and sum totalAmount
  const { data: recentDistributionsResp } = useQuery({
    queryKey: ["recent-distributions"],
    queryFn: async () => {
      return apiClient.getRecentDistributions();
    },
    staleTime: 5000,
    refetchInterval: 15000,
  });

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
    vaultCount,
    contributorCount,
    yieldEarned: formatEther(yieldEarned),
    avgAPY: "0", // Would need to calculate from yield
    isLoading: isLoadingVaults,
  };
}
