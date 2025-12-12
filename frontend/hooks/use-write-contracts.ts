"use client";

import { useEffect, useState, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from "wagmi";
import {
  useContributorRegistry,
  useVaultFactory,
  useSparkVaultFactory,
  useQuadraticVoting,
  useDistribution,
  useVault,
} from "./use-contracts";
import { parseEther, parseUnits, formatEther, Address } from "viem";
import { getAssetAddress, getAssetDecimals } from "@/lib/assets";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { CONTRACTS } from "@/lib/contracts";

/**
 * Hook for creating a vault
 */
export function useCreateVault() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: factoryAddress, abi } = useVaultFactory();
  const { address: sparkFactoryAddress, abi: sparkAbi } =
    useSparkVaultFactory();
  const [vaultData, setVaultData] = useState<{
    pseudoAddress: string;
    name: string;
    description: string;
    asset: string;
    assetName: string;
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createVault = async (
    assetName: string,
    name: string,
    description: string,
    useSpark: boolean = false
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    const assetAddress = getAssetAddress(assetName);

    // Generate a pseudo address for demo (valid hex) to allow selection in UI
    const pseudoAddress =
      "0x" +
      Array.from({ length: 40 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    try {
      console.log("[Vault] Creating vault - saving to backend immediately", {
        name,
        description,
        pseudoAddress,
      });

      // Save to backend immediately (don't wait for blockchain)
      const response = await apiClient.createVault({
        address: pseudoAddress,
        name: name,
        description: description,
        asset: assetAddress,
        deployer: address!,
        totalAssets: "0",
        totalSupply: "0",
      });

      console.log("[Vault] ✅ Backend save successful", response);

      // CRITICAL: Invalidate all vault-related queries to update dashboard immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["vaults"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["backend-vaults-total-assets"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["readContract"], exact: false }),
      ]);

      // Immediately refetch to update dashboard
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["vaults"], exact: false }),
        queryClient.refetchQueries({ queryKey: ["backend-vaults-total-assets"], exact: false }),
      ]);

      console.log("[Vault] ✅ All queries invalidated and refetched - vault should appear in dashboard now");
      // Delay showing success toast so UI updates appear first
      const SUCCESS_TOAST_DELAY_MS = 15000; // 15 seconds
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        toast({
          title: "Success",
          description: "Vault created and visible in the list!",
        });
      }, SUCCESS_TOAST_DELAY_MS);

      // Now initiate blockchain transaction (don't wait for it)
      // Check if on correct network first
      if (chainId !== CONTRACTS.CHAIN_ID) {
        console.log("[Vault] Wrong network - skipping blockchain transaction");
        console.log(
          `[Vault] Please switch to Base Sepolia (Chain ID: ${CONTRACTS.CHAIN_ID})`
        );
        toast({
          title: "Note",
          description: `Vault created in backend. Optionally switch to Base Sepolia and confirm blockchain transaction.`,
        });
        return;
      }

      console.log("[Vault] Initiating blockchain transaction (in background)");

      // Initiate blockchain transaction in the background (don't wait)
      writeContract({
        address: (useSpark ? sparkFactoryAddress : factoryAddress) as Address,
        abi: (useSpark ? sparkAbi : abi) as any,
        functionName: "createVault",
        args: [assetAddress, name, description],
      });

      console.log("[Vault] Blockchain transaction initiated in background");
    } catch (error: any) {
      console.error("[Vault] Error creating vault:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create vault",
        variant: "destructive",
      });
    }
  };

  // Invalidate queries after blockchain confirmation to sync on-chain data
  useEffect(() => {
    if (isSuccess && hash && vaultData) {
      toast({
        title: "Success",
        description: "Blockchain transaction confirmed! Syncing vault data...",
      });

      // Wait 2 seconds for blockchain to index, then sync and refetch
      const timer = setTimeout(async () => {
        console.log("[Vault] 🔄 Blockchain confirmed, syncing vaults and refetching queries...");
        
        // Trigger backend sync to update database with real vault address
        try {
          await apiClient.syncVaults();
          console.log("[Vault] ✅ Vaults synced from blockchain to database");
        } catch (error) {
          console.warn("[Vault] ⚠️ Could not sync vaults (this is okay):", error);
        }
        
        // Refetch all queries
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ["vaults"], exact: false }),
          queryClient.refetchQueries({ queryKey: ["backend-vaults-total-assets"], exact: false }),
          queryClient.refetchQueries({ queryKey: ["readContract"], exact: false }),
        ]);

        console.log("[Vault] ✅ All queries refetched after blockchain confirmation");
        
        // Clear vault data
        setVaultData(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, vaultData, queryClient, toast]);

  return {
    createVault,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook for adding a contributor
 */
export function useAddContributor() {
  const { address } = useAccount();
  const {
    writeContract,
    isPending,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: registryAddress, abi } = useContributorRegistry();
  const [contributorData, setContributorData] = useState<{
    vaultAddress: Address;
    wallet: Address;
    name: string;
    role: string;
    monthlyAllocation: string;
  } | null>(null);

  useEffect(() => {
    if (writeError) {
      const errorMessage = writeError.message || "Failed to add contributor";
      if (
        errorMessage.includes("onlyOwner") ||
        errorMessage.includes("Ownable")
      ) {
        toast({
          title: "Permission Denied",
          description:
            "Only the ContributorRegistry owner can add contributors. Please contact the owner.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
    if (receiptError) {
      const errorMessage = receiptError.message || "Transaction failed";
      if (
        errorMessage.includes("onlyOwner") ||
        errorMessage.includes("Ownable")
      ) {
        toast({
          title: "Transaction Failed",
          description:
            "Only the ContributorRegistry owner can add contributors. The transaction was reverted.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  }, [writeError, receiptError, toast]);

  const addContributor = async (
    vaultAddress: Address,
    wallet: Address,
    name: string,
    role: string,
    monthlyAllocation: string
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    // Convert monthly allocation to wei (18 decimals) - add 18 zeros
    const allocation = parseEther(monthlyAllocation);
    // Convert to string for backend (wei format with 18 decimals)
    const monthlyAllocationWei = allocation.toString();

    try {
      // STEP 1: Save to backend immediately (don't wait for blockchain)
      console.log("[addContributor] Saving to backend...", {
        vaultAddress,
        wallet,
        name,
        role,
        monthlyAllocation: monthlyAllocation, // Dollar value
        monthlyAllocationWei: monthlyAllocationWei, // Wei value (18 decimals)
      });

      // Send wei value (with 18 zeros) to backend instead of dollar value
      await apiClient.createContributor({
        vault: String(vaultAddress),
        wallet: String(wallet),
        name,
        role,
        monthlyAllocation: monthlyAllocationWei, // Send wei format (18 decimals)
      });

      console.log("[addContributor] ✅ Contributor saved to backend, invalidating queries...");

      // CRITICAL: Invalidate queries immediately after backend save
      // This ensures the dashboard updates right away
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["all-contributors"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["contributors"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["backend-vaults-total-assets"],
          exact: false,
        }),
      ]);

      // Immediately refetch to update dashboard
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["all-contributors"],
          exact: false,
        }),
        queryClient.refetchQueries({
          queryKey: ["contributors"],
          exact: false,
        }),
        queryClient.refetchQueries({
          queryKey: ["backend-vaults-total-assets"],
          exact: false,
        }),
      ]);

      console.log("[addContributor] ✅ Dashboard queries invalidated and refetched - contributor should appear now");

      // STEP 2: Initiate blockchain transaction in background (don't wait)
      console.log(
        "[addContributor] Initiating blockchain transaction...",
        registryAddress,
        vaultAddress,
        wallet,
        name,
        role,
        allocation
      );

      // Store data for blockchain transaction
      setContributorData({
        vaultAddress,
        wallet,
        name,
        role,
        monthlyAllocation,
      });

      // Initiate blockchain write without waiting for confirmation
      writeContract({
        address: registryAddress as Address,
        abi,
        functionName: "addContributor",
        args: [vaultAddress, wallet, name, role, allocation],
      });

      // Don't throw error - blockchain transaction is now in background
      // User can continue using the app
    } catch (error: any) {
      console.error("[addContributor] Backend save failed", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to add contributor to backend. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Also invalidate queries after blockchain confirmation (to sync on-chain data)
  useEffect(() => {
    if (isSuccess && hash && contributorData) {
      toast({
        title: "Success",
        description:
          "Blockchain transaction confirmed! Refreshing data...",
      });

      // Wait 2 seconds for blockchain to index, then refetch
      const timer = setTimeout(async () => {
        console.log("[addContributor] 🔄 Blockchain confirmed, refetching all queries...");
        
        // Refetch all contributor-related queries to sync on-chain data
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ["readContract"],
            exact: false,
          }),
          queryClient.refetchQueries({
            queryKey: ["contributors"],
            exact: false,
          }),
          queryClient.refetchQueries({
            queryKey: ["all-contributors"],
            exact: false,
          }),
          queryClient.refetchQueries({
            queryKey: ["backend-vaults-total-assets"],
            exact: false,
          }),
        ]);

        console.log(
          "[addContributor] ✅ All queries refetched after blockchain confirmation"
        );

        // Clear contributor data
        setContributorData(null);
      }, 2000); // Reduced from 15 seconds to 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, contributorData, queryClient, toast]);

  return {
    addContributor,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook for depositing to a vault
 */
export function useDeposit() {
  const { address } = useAccount();
  const {
    writeContract,
    isPending,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { abi } = useVault();

  // Track approval and deposit state
  const [approvalHash, setApprovalHash] = useState<string | null>(null);
  const [depositHash, setDepositHash] = useState<string | null>(null);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState<{
    vaultAddress: Address;
    assetName: string;
    amount: string;
    receiver?: Address;
    assetAddress?: Address;
  } | null>(null);

  // Track approval transaction
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash as `0x${string}` | undefined,
    });

  useEffect(() => {
    if (hash) {
      if (isWaitingForApproval) {
        setApprovalHash(hash);
        setDepositHash(null);
      } else {
        setDepositHash(hash);
      }
    }
  }, [hash, isWaitingForApproval]);

  useEffect(() => {
    if (isApprovalSuccess && approvalHash && pendingDeposit) {
      setIsWaitingForApproval(false);
      setApprovalHash(null);

      setTimeout(() => {
        const {
          vaultAddress,
          assetName,
          amount,
          receiver,
          assetAddress: assetAddressParam,
        } = pendingDeposit;
        const finalAssetAddress =
          assetAddressParam || getAssetAddress(assetName);
        const decimals = getAssetDecimals(assetName);
        const amountWei = parseUnits(amount, decimals);

        toast({
          title: "Depositing...",
          description: "Please confirm the transaction in your wallet",
        });

        writeContract({
          address: vaultAddress,
          abi: abi as any,
          functionName: "deposit",
          args: [amountWei, receiver || address],
        });

        setPendingDeposit(null);
      }, 1000);
    }
  }, [
    isApprovalSuccess,
    approvalHash,
    pendingDeposit,
    address,
    abi,
    toast,
    writeContract,
  ]);

  const deposit = async (
    vaultAddress: Address,
    assetName: string,
    amount: string,
    receiver?: Address,
    assetAddress?: Address
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    // Use provided asset address or convert from asset name
    const finalAssetAddress = assetAddress || getAssetAddress(assetName);

    // Get decimals from asset name or use 18 as default
    const decimals = getAssetDecimals(assetName);
    const amountWei = parseUnits(amount, decimals);

    if (amountWei === 0n) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      const assetAddressToUse = finalAssetAddress;

      if (assetName === "ETH") {
        const wethAddress = getAssetAddress("WETH");

        toast({
          title: "Converting ETH to USDC...",
          description: "Step 1: Wrapping ETH to WETH",
        });

        writeContract({
          address: wethAddress as Address,
          abi: [
            {
              constant: false,
              inputs: [],
              name: "deposit",
              outputs: [],
              payable: true,
              stateMutability: "payable",
              type: "function",
            },
          ],
          functionName: "deposit",
          value: amountWei,
        });

        return;
      }

      if (assetName !== "ETH") {
        const allowance = await queryClient.fetchQuery({
          queryKey: ["allowance", assetAddressToUse, address, vaultAddress],
          queryFn: async () => {
            const { readContract } = await import("wagmi/actions");
            const { createPublicClient, http } = await import("viem");
            const { baseSepolia } = await import("wagmi/chains");

            const publicClient = createPublicClient({
              chain: baseSepolia,
              transport: http(),
            });

            return (await publicClient.readContract({
              address: assetAddressToUse as Address,
              abi: [
                {
                  constant: true,
                  inputs: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                  ],
                  name: "allowance",
                  outputs: [{ name: "", type: "uint256" }],
                  type: "function",
                },
              ],
              functionName: "allowance",
              args: [address, vaultAddress],
            })) as bigint;
          },
        });

        if (allowance < amountWei) {
          toast({
            title: "Approving...",
            description: "Please approve the transaction in your wallet",
          });

          setPendingDeposit({
            vaultAddress,
            assetName,
            amount,
            receiver,
            assetAddress,
          });
          setIsWaitingForApproval(true);

          writeContract({
            address: assetAddressToUse as Address,
            abi: [
              {
                constant: false,
                inputs: [
                  { name: "spender", type: "address" },
                  { name: "amount", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                type: "function",
              },
            ],
            functionName: "approve",
            args: [vaultAddress, amountWei],
          });

          return;
        }
      }

      toast({
        title: "Depositing...",
        description: "Please confirm the transaction in your wallet",
      });

      writeContract({
        address: vaultAddress,
        abi: abi as any,
        functionName: "deposit",
        args: [amountWei, receiver || address],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deposit",
        variant: "destructive",
      });
      setIsWaitingForApproval(false);
      setPendingDeposit(null);
      throw error;
    }
  };

  useEffect(() => {
    if (isSuccess && hash && hash === depositHash && !isWaitingForApproval) {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["readContract"],
          exact: false,
        });
        queryClient.refetchQueries({
          queryKey: ["readContract"],
          exact: false,
        });
        queryClient.invalidateQueries({ queryKey: ["vaults"] });
        queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["balanceOf"] });
        queryClient.invalidateQueries({ queryKey: ["allowance"] });
      }, 2000);

      toast({
        title: "Success",
        description: "Deposit successful! Refreshing vault data...",
      });
    } else if (isSuccess && hash === approvalHash) {
      toast({
        title: "Approval confirmed",
        description: "Proceeding with deposit...",
      });
    }
  }, [
    isSuccess,
    hash,
    depositHash,
    approvalHash,
    isWaitingForApproval,
    queryClient,
    toast,
  ]);

  return {
    deposit,
    isPending: isPending || isConfirming || isApprovalConfirming,
    isSuccess: isSuccess && hash === depositHash, // Only true for deposit, not approval
    hash: depositHash || hash, // Return deposit hash if available, otherwise current hash
    isApproving: isWaitingForApproval || isApprovalConfirming,
  };
}

/**
 * Hook for withdrawing from a vault
 */
export function useWithdraw() {
  const { address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { abi } = useVault();

  const withdraw = async (
    vaultAddress: Address,
    shares: string,
    receiver?: Address,
    owner?: Address
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    const sharesWei = parseEther(shares);

    if (sharesWei === 0n) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    // Allow withdrawal - let the contract handle balance validation
    try {
      toast({
        title: "Withdrawing...",
        description: "Please confirm the transaction in your wallet",
      });

      writeContract({
        address: vaultAddress,
        abi: abi as any,
        functionName: "redeem",
        args: [sharesWei, receiver || address, owner || address],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Refresh vault data after successful withdrawal
  useEffect(() => {
    if (isSuccess && hash) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["vaults"] });
        queryClient.invalidateQueries({ queryKey: ["vaultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["balanceOf"] });
      }, 2000);

      toast({
        title: "Success",
        description: "Withdrawal successful!",
      });
    }
  }, [isSuccess, hash, queryClient, toast]);

  return {
    withdraw,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook for voting
 */
export function useVote() {
  const { address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: votingAddress, abi } = useQuadraticVoting();

  const vote = async (votingId: bigint, voteCount: number, isFor: boolean) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    // Calculate cost (quadratic: n²).
    // Use zero cost for now (optimistic backend-first flow) so votes can be recorded
    // even if chain payments are unreliable in dev.
    const cost = 0n;

    try {
      // Initiate blockchain transaction in background (fire-and-forget)
      writeContract({
        address: votingAddress as Address,
        abi,
        functionName: "vote",
        args: [votingId, BigInt(voteCount), isFor],
        value: cost,
      });

      // Optimistic backend update: increment vote counts immediately so UI reflects action
      try {
        if (isFor) {
          await apiClient.incrementVote(String(votingId), voteCount, 0);
        } else {
          await apiClient.incrementVote(String(votingId), 0, voteCount);
        }

        // Update React Query cache for active/past votings so UI reflects change immediately
        try {
          // Update active votings cache if present
          queryClient.setQueryData(["votings", "active"], (oldData: any) => {
            if (!oldData || !oldData.success || !Array.isArray(oldData.data))
              return oldData;
            const updated = oldData.data.map((v: any) => {
              if (String(v.votingId) === String(votingId)) {
                return {
                  ...v,
                  votesFor: v.votesFor + (isFor ? voteCount : 0),
                  votesAgainst: v.votesAgainst + (isFor ? 0 : voteCount),
                  totalVotes: v.totalVotes + voteCount,
                };
              }
              return v;
            });
            return { ...oldData, data: updated };
          });

          // Update past votings cache as well
          queryClient.setQueryData(["votings", "past"], (oldData: any) => {
            if (!oldData || !oldData.success || !Array.isArray(oldData.data))
              return oldData;
            const updated = oldData.data.map((v: any) => {
              if (String(v.votingId) === String(votingId)) {
                return {
                  ...v,
                  votesFor: v.votesFor + (isFor ? voteCount : 0),
                  votesAgainst: v.votesAgainst + (isFor ? 0 : voteCount),
                  totalVotes: v.totalVotes + voteCount,
                };
              }
              return v;
            });
            return { ...oldData, data: updated };
          });

          // As a fallback, invalidate/refetch the generic votings queries and contract reads
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["votings", "active"],
              exact: false,
            }),
            queryClient.invalidateQueries({
              queryKey: ["votings", "past"],
              exact: false,
            }),
            queryClient.invalidateQueries({
              queryKey: ["votings"],
              exact: false,
            }),
            queryClient.invalidateQueries({
              queryKey: ["readContract"],
              exact: false,
            }),
          ]);
        } catch (cacheErr) {
          console.error(
            "[vote] Failed to update cache/refresh votings:",
            cacheErr
          );
        }
      } catch (incErr) {
        console.error("[vote] Failed to increment backend counts:", incErr);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to vote",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["votings"],
          exact: false,
        });
        queryClient.refetchQueries({
          queryKey: ["votings"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["readContract"],
          exact: false,
        });
      }, 2000);

      toast({
        title: "Success",
        description: "Vote cast successfully! Refreshing voting data...",
      });
    }
  }, [isSuccess, hash, queryClient, toast]);

  return {
    vote,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook for creating a voting
 */
export function useCreateVoting() {
  const { address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: votingAddress, abi } = useQuadraticVoting();
  const [votingData, setVotingData] = useState<{
    vaultAddress: Address;
    nominee: Address;
    nomineeName: string;
    role: string;
    description: string;
    duration: number;
  } | null>(null);

  const createVoting = async (
    vaultAddress: Address,
    nominee: Address,
    nomineeName: string,
    role: string,
    description: string,
    duration: number // in seconds
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      // STEP 1: Save voting to backend immediately (don't wait for blockchain)
      console.log("[createVoting] Saving to backend...", {
        vaultAddress,
        nominee,
        nomineeName,
        description,
        duration,
      });

      const now = Date.now();
      const startTime = now;
      const endTime = now + duration * 1000;

      await apiClient.createVoting({
        vault: String(vaultAddress),
        nominee: String(nominee),
        nomineeName,
        description,
        startTime,
        endTime,
      });

      toast({
        title: "Success",
        description:
          "Voting created successfully! Waiting for blockchain confirmation...",
      });

      // DO NOT invalidate queries here - wait for blockchain confirmation
      // This ensures the voting card won't appear until MetaMask confirms

      // STEP 2: Initiate blockchain transaction in background (don't wait)
      console.log(
        "[createVoting] Initiating blockchain transaction...",
        votingAddress,
        vaultAddress,
        nominee
      );

      // Store voting data for blockchain transaction
      setVotingData({
        vaultAddress,
        nominee,
        nomineeName,
        role,
        description,
        duration,
      });

      // Initiate blockchain write without waiting for confirmation
      writeContract({
        address: votingAddress as Address,
        abi,
        functionName: "createVoting",
        args: [
          vaultAddress,
          nominee,
          nomineeName,
          role,
          description,
          BigInt(duration),
        ],
      });

      // Don't throw error - blockchain transaction is now in background
      // User can continue using the app
    } catch (error: any) {
      console.error("[createVoting] Backend save failed", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create voting. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Refetch immediately after backend save (to show voting card via backend data)
  useEffect(() => {
    if (votingData) {
      // Immediately refetch to show voting card from backend
      const timer = setTimeout(async () => {
        await queryClient.refetchQueries({
          queryKey: ["votings", "active"],
        });
        await queryClient.refetchQueries({
          queryKey: ["votings", "past"],
        });

        console.log(
          "[createVoting] Backend votings refetched - card should appear now"
        );
      }, 500); // Small delay to ensure backend has processed

      return () => clearTimeout(timer);
    }
  }, [votingData, queryClient]);

  // Refetch again after blockchain confirmation (to ensure consistency)
  useEffect(() => {
    if (isSuccess && hash && votingData) {
      toast({
        title: "Success",
        description: "Voting confirmed on blockchain!",
      });

      // Wait a bit then refetch again to sync with blockchain state
      const timer = setTimeout(async () => {
        // Refetch queries to get latest blockchain state
        await queryClient.refetchQueries({
          queryKey: ["votings"],
          exact: false,
        });

        console.log(
          "[createVoting] Queries refetched after blockchain confirmation"
        );

        // Clear voting data
        setVotingData(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, votingData, queryClient, toast]);

  return {
    createVoting,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

/**
 * Hook for scheduling a distribution
 */
export function useScheduleDistribution() {
  const { address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: distributionAddress, abi } = useDistribution();

  const scheduleDistribution = async (
    vaultAddress: Address,
    scheduledTime: number, // Unix timestamp
    method: number // 0 = Proportional, 1 = Equal, 2 = VotingWeighted
  ) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: distributionAddress as Address,
        abi,
        functionName: "scheduleDistribution",
        args: [vaultAddress, BigInt(scheduledTime), method],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule distribution",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["distributions"],
          exact: false,
        });
        queryClient.refetchQueries({
          queryKey: ["distributions"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["readContract"],
          exact: false,
        });
      }, 2000);

      toast({
        title: "Success",
        description:
          "Distribution scheduled successfully! Refreshing distribution list...",
      });
    }
  }, [isSuccess, hash, queryClient, toast]);

  return {
    scheduleDistribution,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
