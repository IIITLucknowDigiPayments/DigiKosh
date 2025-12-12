"use client";

import { useReadContract } from "wagmi";
import { useVaultFactory, useSparkVaultFactory } from "./use-contracts";
import { Address } from "viem";
import { useMemo, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import VaultABI from "@/lib/abis/Vault.json";
import SparkVaultABI from "@/lib/abis/SparkVault.json";
import { ASSETS } from "@/lib/assets";

export interface VaultInfo {
  address: Address;
  name: string;
  description: string;
  totalAssets: bigint;
  totalSupply: bigint;
  asset: Address;
}

export function useAllVaults() {
  const { address: factoryAddress, abi: factoryABI } = useVaultFactory();
  const { address: sparkFactoryAddress, abi: sparkFactoryABI } =
    useSparkVaultFactory();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: regularVaultCount, isLoading: isLoadingRegularCount } =
    useReadContract({
      address: factoryAddress,
      abi: factoryABI,
      functionName: "getVaultCount",
      query: {
        refetchInterval: 5000,
      },
    });

  const { data: sparkVaultCount, isLoading: isLoadingSparkCount } =
    useReadContract({
      address: sparkFactoryAddress,
      abi: sparkFactoryABI,
      functionName: "getVaultCount",
      query: {
        refetchInterval: 5000,
      },
    });

  const { data: regularVaults, isLoading: isLoadingRegularVaults } =
    useReadContract({
      address: factoryAddress,
      abi: factoryABI,
      functionName: "getAllVaults",
      query: {
        enabled: !!regularVaultCount && Number(regularVaultCount) > 0,
        refetchInterval: 5000,
      },
    });

  const { data: sparkVaults, isLoading: isLoadingSparkVaults } =
    useReadContract({
      address: sparkFactoryAddress,
      abi: sparkFactoryABI,
      functionName: "getAllVaults",
      query: {
        enabled: !!sparkVaultCount && Number(sparkVaultCount) > 0,
        refetchInterval: 5000,
      },
    });

  const OLD_VAULT_ADDRESSES = [
    "0x1F029A152BC240F38Adc3Be70EE62A01D7F9fEca",
  ].map((addr) => addr.toLowerCase());

  const allVaults = useMemo(() => {
    const regular = (regularVaults as Address[]) || [];
    const spark = (sparkVaults as Address[]) || [];
    const uniqueVaults = Array.from(new Set([...regular, ...spark]));
    const filteredVaults = uniqueVaults.filter((vault) => {
      const vaultLower = vault.toLowerCase();
      return !OLD_VAULT_ADDRESSES.includes(vaultLower);
    });
    return filteredVaults;
  }, [regularVaults, sparkVaults]);

  // Backend vaults fallback (to show created vaults even if on-chain indexing fails)
  const [backendVaults, setBackendVaults] = useState<Address[] | undefined>(
    undefined
  );

  // Fetch backend vaults with periodic refetch
  useEffect(() => {
    let mounted = true;
    const fetchBackendVaults = async () => {
      try {
        console.log("[useAllVaults] Fetching backend vaults...");
        const res = await apiClient.getVaults();
        if (!mounted) return;
        if (res && res.success && Array.isArray(res.data)) {
          const addresses = res.data.map((v: any) => v.address as Address);
          console.log("[useAllVaults] Backend vaults fetched:", addresses);
          setBackendVaults(addresses);
        } else {
          console.log("[useAllVaults] No vaults in response");
          setBackendVaults([]);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[useAllVaults] Error fetching backend vaults:", err);
        setBackendVaults([]);
      }
    };

    // Fetch immediately
    fetchBackendVaults();

    // Refetch every 3 seconds to catch newly created vaults
    const interval = setInterval(fetchBackendVaults, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshKey]);

  // Combine chain vaults with backend vaults (unique)
  const combinedVaults = useMemo(() => {
    const chain = allVaults || [];
    const backend = backendVaults || [];
    const merged = Array.from(new Set([...chain, ...backend]));
    console.log("[useAllVaults] Combined vaults:", {
      chain: chain.length,
      backend: backend.length,
      merged: merged.length,
      merged_addresses: merged,
    });
    return merged;
  }, [allVaults, backendVaults]);

  // Use the actual length of combined vaults (includes both on-chain and backend vaults)
  // This gives us the real number of unique vaults
  const actualVaultCount = useMemo(() => {
    return combinedVaults.length;
  }, [combinedVaults]);

  return {
    vaults: combinedVaults.length > 0 ? combinedVaults : undefined,
    vaultCount: actualVaultCount, // Use actual count of unique vaults
    isLoading:
      isLoadingRegularCount ||
      isLoadingSparkCount ||
      isLoadingRegularVaults ||
      isLoadingSparkVaults,
  };
}

export function useVaultInfo(vaultAddress?: Address) {
  const {
    data: sparkVaultInfo,
    isLoading: isLoadingSpark,
    error: sparkError,
    refetch: refetchSpark,
  } = useReadContract({
    address: vaultAddress,
    abi: SparkVaultABI.abi as any,
    functionName: "getVaultInfo",
    query: {
      enabled: !!vaultAddress,
      refetchInterval: 5000,
    },
  });

  const {
    data: vaultInfo,
    isLoading: isLoadingVault,
    error: vaultError,
    refetch: refetchVault,
  } = useReadContract({
    address: vaultAddress,
    abi: VaultABI.abi as any,
    functionName: "getVaultInfo",
    query: {
      enabled: !!vaultAddress && !!sparkError,
      refetchInterval: 5000,
    },
  });

  const info = sparkVaultInfo || vaultInfo;

  let parsedInfo:
    | {
        name: string;
        description: string;
        totalAssetsValue: bigint;
        totalSupplyValue: bigint;
      }
    | undefined = undefined;

  if (info) {
    if (Array.isArray(info)) {
      parsedInfo = {
        name: String(info[0] || "").trim(),
        description: String(info[1] || "").trim(),
        totalAssetsValue: BigInt(info[2] || 0),
        totalSupplyValue: BigInt(info[3] || 0),
      };
    } else if (typeof info === "object" && info !== null) {
      parsedInfo = {
        name: String((info as any).name || "").trim(),
        description: String((info as any).description || "").trim(),
        totalAssetsValue: BigInt(
          (info as any).totalAssetsValue || (info as any).totalAssets || 0
        ),
        totalSupplyValue: BigInt(
          (info as any).totalSupplyValue || (info as any).totalSupply || 0
        ),
      };
    }
  }

  return {
    vaultInfo: parsedInfo,
    isLoading: isLoadingVault || isLoadingSpark,
    error: sparkError || vaultError,
    refetch: sparkVaultInfo ? refetchSpark : refetchVault,
  };
}

/**
 * Hook to get backend vault data by address
 * Used for newly created vaults that are in backend but may not be on-chain yet
 */
export function useBackendVaultData(address?: Address) {
  const [vaultData, setVaultData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVaultData = async () => {
    if (!address) {
      setVaultData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getVault(address);
      if (response.success && response.data) {
        console.log("[useBackendVaultData] Fetched vault:", response.data);
        setVaultData(response.data);
      } else {
        console.warn(
          `[useBackendVaultData] Vault not found or no data: ${address}`
        );
        setVaultData(null);
        if (!response.success) {
          setError(new Error((response as any).error || "Vault not found"));
        }
      }
    } catch (err: any) {
      console.error("[useBackendVaultData] Error fetching vault:", err);
      setError(err);
      setVaultData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, [address]);

  return { vaultData, isLoading, error, refetch: fetchVaultData };
}

// Hook to get all vaults WITH names (for dropdowns/selectors)
export function useAllVaultsWithNames() {
  const [vaultsWithNames, setVaultsWithNames] = useState<
    Array<{ address: Address; name: string }> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchVaultsWithNames = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getVaults();
        if (!mounted) return;

        if (response && response.success && Array.isArray(response.data)) {
          const vaultsData = response.data.map((v: any) => ({
            address: v.address as Address,
            name:
              v.name ||
              `Vault ${v.address.slice(0, 6)}...${v.address.slice(-4)}`,
          }));
          console.log(
            "[useAllVaultsWithNames] Fetched vaults with names:",
            vaultsData
          );
          setVaultsWithNames(vaultsData);
        } else {
          setVaultsWithNames([]);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[useAllVaultsWithNames] Error fetching vaults:", err);
        setVaultsWithNames([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchVaultsWithNames();

    // Refetch every 3 seconds to catch newly created vaults
    const interval = setInterval(fetchVaultsWithNames, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { vaultsWithNames, isLoading };
}
