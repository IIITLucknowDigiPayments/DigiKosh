"use client";

import { useAllVaults } from "./use-vaults";
import { useMemo, useEffect } from "react";
import { formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ASSET_DECIMALS } from "@/lib/assets";

// USDC has 6 decimals, most other tokens have 18
const DEFAULT_DECIMALS = 6; // Defaulting to USDC decimals since most vaults use USDC

export function useDashboardStats() {
  const { vaultCount, isLoading: isLoadingVaults } = useAllVaults();

  // Fetch all vaults from backend API - this returns data directly from database
  const { data: backendVaultsData, isLoading: isLoadingBackendVaults, refetch: refetchVaults } = useQuery({
    queryKey: ["backend-vaults-total-assets"],
    queryFn: async () => {
      try {
        const response = await apiClient.getVaults();
        if (response.success && Array.isArray(response.data)) {
          console.log(`[Dashboard] ✅ Fetched ${response.data.length} vaults from database`);
          
          // Log each vault's totalAssets for debugging
          response.data.forEach((vault: any, index: number) => {
            const assetsStr = String(vault.totalAssets || '0');
            const decimals = getDecimalsForAsset(vault.asset);
            const formatted = formatUnits(BigInt(assetsStr || '0'), decimals);
            console.log(`[Dashboard] Vault ${index + 1}: ${vault.address?.slice(0, 8)}... | totalAssets: ${assetsStr} (${formatted} tokens)`);
          });
          
          return response.data;
        }
        console.warn("[Dashboard] ⚠️ No vaults data in response");
        return [];
      } catch (error) {
        console.error("[Dashboard] ❌ Error fetching vaults from backend:", error);
        return [];
      }
    },
    staleTime: 0, // Always refetch to get latest data
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true,
  });

  // Trigger sync on mount to ensure database is up to date
  useEffect(() => {
    const syncVaults = async () => {
      try {
        // Call sync endpoint to update database from blockchain
        const result = await apiClient.syncVaults();
        if (result.success) {
          console.log('[Dashboard] ✅ Vaults synced:', result.message);
          // Refetch vaults after sync
          refetchVaults();
        }
      } catch (error) {
        console.warn('[Dashboard] ⚠️ Could not sync vaults (this is okay if backend is not available):', error);
      }
    };
    
    // Sync once on mount (with a small delay to let the component mount)
    const timeout = setTimeout(syncVaults, 1000);
    
    // Also sync periodically every 30 seconds
    const syncInterval = setInterval(syncVaults, 30000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(syncInterval);
    };
  }, [refetchVaults]);

  // Helper function to get decimals for an asset address
  const getDecimalsForAsset = (assetAddress?: string): number => {
    if (!assetAddress) return DEFAULT_DECIMALS;
    
    // Check if it's USDC (most common)
    const usdcAddresses = [
      '0x437A82737FF31437D9F0dD20068546c9e094b4db', // New USDC
      '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Old USDC
    ];
    
    const normalizedAddress = assetAddress.toLowerCase();
    if (usdcAddresses.some(addr => addr.toLowerCase() === normalizedAddress)) {
      return ASSET_DECIMALS.USDC; // 6 decimals
    }
    
    // Default to 6 decimals for USDC (most vaults use USDC)
    return DEFAULT_DECIMALS;
  };

  // Calculate TOTAL ASSETS: Simple sum of all vault.totalAssets from database
  // NO additional math - just sum all totalAssets values
  const { totalAssetsBigInt, totalAssetsFormatted } = useMemo(() => {
    if (!backendVaultsData || backendVaultsData.length === 0) {
      return { totalAssetsBigInt: 0n, totalAssetsFormatted: "0" };
    }
    
    let sum = 0n;
    let validVaults = 0;
    const vaultDetails: Array<{ address: string; assets: string }> = [];
    
    // Simply sum all totalAssets values - no conversion, no additional math
    // totalAssets is already in base unit (6 decimals) from backend
    backendVaultsData.forEach((vault: any) => {
      if (vault && vault.totalAssets) {
        try {
          const assetsStr = String(vault.totalAssets).trim();
          if (assetsStr && assetsStr !== '0' && assetsStr !== '') {
            // Convert to BigInt and add directly
            // totalAssets from backend is already in base unit (6 decimals for USDC)
            const assets = BigInt(assetsStr);
            sum += assets;
            validVaults++;
            vaultDetails.push({
              address: vault.address || 'unknown',
              assets: assetsStr,
            });
            console.log(`[Dashboard] Vault ${vault.address?.slice(0, 8)}...: totalAssets = ${assetsStr} (base unit, 6 decimals)`);
          }
        } catch (e) {
          console.warn(`[Dashboard] ⚠️ Error parsing totalAssets for vault ${vault.address}:`, vault.totalAssets, e);
        }
      }
    });
    
    // Format the sum using 6 decimals (USDC standard)
    // sum is already in base unit (6 decimals), so formatUnits with 6 decimals
    const formatted = formatUnits(sum, DEFAULT_DECIMALS);
    
    console.log(`[Dashboard] 📊 Total Assets Calculation (SIMPLE SUM):`, {
      totalVaults: backendVaultsData.length,
      validVaults,
      sum: sum.toString(),
      formatted: `$${Number(formatted).toFixed(2)}`,
      vaultBreakdown: vaultDetails.map(v => ({
        addr: v.address.slice(0, 8) + '...',
        totalAssets: v.assets
      }))
    });
    
    return { 
      totalAssetsBigInt: sum, 
      totalAssetsFormatted: formatted 
    };
  }, [backendVaultsData]);

  // Calculate YIELD: 0.19% of total assets
  // Monthly yield = Total Assets * 0.19% = Total Assets * 19 / 10000
  const monthlyYield = useMemo(() => {
    if (totalAssetsBigInt === 0n) return 0n;
    return (totalAssetsBigInt * 19n) / 10000n;
  }, [totalAssetsBigInt]);

  // Format monthly yield for display (using 6 decimals)
  const monthlyYieldFormatted = useMemo(() => {
    if (monthlyYield === 0n) return "0";
    return formatUnits(monthlyYield, DEFAULT_DECIMALS);
  }, [monthlyYield]);

  // Calculate APY from monthly yield
  // Monthly rate = 0.19% = 0.0019
  // APY = (((1 + 0.0019)^12) - 1) * 100
  const monthlyRate = 0.0019;
  const apyPercent = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  const apyFormatted = apyPercent.toLocaleString(undefined, { 
    maximumFractionDigits: 2 
  });

  // Get CONTRIBUTOR COUNT: Fetch from backend API
  const { data: allApiContributors, refetch: refetchContributors } = useQuery({
    queryKey: ["all-contributors"],
    queryFn: async () => {
      try {
        const response = await apiClient.getContributors();
        if (response.success && Array.isArray(response.data)) {
          console.log(`[Dashboard] ✅ Fetched ${response.data.length} contributors from database`);
          return response;
        }
        return { success: false, data: [] };
      } catch (error) {
        console.error("[Dashboard] ❌ Error fetching contributors:", error);
        return { success: false, data: [] };
      }
    },
    staleTime: 0, // Always refetch
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true,
  });

  const contributorCount = useMemo(() => {
    if (!allApiContributors || !allApiContributors.success) return 0;
    const count = Array.isArray(allApiContributors.data) ? allApiContributors.data.length : 0;
    console.log(`[Dashboard] 👥 Contributor Count: ${count}`);
    return count;
  }, [allApiContributors]);

  return {
    // Total Assets: Formatted sum of all vault.totalAssets from database
    totalAssets: totalAssetsFormatted,
    
    // Yield: 0.19% of total assets (formatted)
    totalYield: monthlyYieldFormatted,
    yieldEarned: monthlyYieldFormatted,
    
    // APY: Calculated from 0.19% monthly rate
    yieldAPY: apyFormatted,
    avgAPY: apyFormatted,
    
    // Vault Count: Actual number of deployed vaults
    vaultCount: vaultCount || 0,
    
    // Contributor Count: Actual number of contributors from database
    contributorCount,
    
    // Loading state
    isLoading: isLoadingVaults || isLoadingBackendVaults,
    
    // Refetch functions for manual refresh
    refetchVaults,
    refetchContributors,
  };
}
