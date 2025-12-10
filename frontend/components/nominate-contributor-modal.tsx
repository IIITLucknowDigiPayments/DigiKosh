"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateVoting } from "@/hooks/use-write-contracts";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { useAllVaults, useAllVaultsWithNames } from "@/hooks/use-vaults";
import {
  useVaultContributors,
  useBackendContributors,
} from "@/hooks/use-contributors";
import { useApiActiveVotings, useApiPastVotings } from "@/hooks/use-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NominateContributorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultAddress?: Address;
}

export function NominateContributorModal({
  open,
  onOpenChange,
  vaultAddress,
}: NominateContributorModalProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();
  const { createVoting, isPending, isSuccess, hash } = useCreateVoting();
  const { vaultsWithNames } = useAllVaultsWithNames();
  const { refetch: refetchActiveVotings } = useApiActiveVotings();
  const { refetch: refetchPastVotings } = useApiPastVotings();

  const [formData, setFormData] = useState({
    vault: vaultAddress || "",
    nominee: "",
    nomineeName: "",
    role: "",
    description: "",
    duration: "7", // days
  });

  const selectedVault = (vaultAddress || formData.vault) as Address | undefined;
  // Get contributors from both blockchain and backend
  const {
    contributorData: blockchainContributors,
    isLoading: isLoadingBlockchain,
  } = useVaultContributors(selectedVault);
  const { contributors: backendContributors, isLoading: isLoadingBackend } =
    useBackendContributors(selectedVault);

  // Combine both sources - prefer blockchain, fall back to backend
  const contributors = useMemo(() => {
    if (blockchainContributors && blockchainContributors.length > 0) {
      return blockchainContributors;
    }
    return backendContributors || [];
  }, [blockchainContributors, backendContributors]);

  const isLoadingContributors = isLoadingBlockchain || isLoadingBackend;

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        vault: vaultAddress || "",
        nominee: "",
        nomineeName: "",
        role: "",
        description: "",
        duration: "7",
      });
    }
  }, [open, vaultAddress]);

  // Auto-fill contributor details when selected
  const handleContributorSelect = (contributorWallet: string) => {
    const contributor = contributors?.find(
      (c: any) => c.wallet.toLowerCase() === contributorWallet.toLowerCase()
    );
    if (contributor) {
      setFormData({
        ...formData,
        nominee: contributor.wallet,
        nomineeName: contributor.name || "",
        role: contributor.role || "",
      });
    }
  };

  // Filter active contributors from combined sources
  const activeContributors = useMemo(() => {
    return (
      contributors?.filter((c: any) => {
        // For blockchain contributors: check isActive boolean
        if (c.isActive !== undefined) {
          return c.isActive !== false;
        }
        // For backend contributors or if isActive is not defined, include them
        return true;
      }) || []
    );
  }, [contributors]);

  useEffect(() => {
    if (isSuccess && hash) {
      // Blockchain transaction succeeded
      toast({
        title: "Success",
        description: "Voting confirmed on blockchain!",
      });

      // Clear form and close modal after 1 second
      setTimeout(() => {
        onOpenChange(false);
        setFormData({
          vault: vaultAddress || "",
          nominee: "",
          nomineeName: "",
          role: "",
          description: "",
          duration: "7",
        });
      }, 1000);

      return;
    }
  }, [isSuccess, isPending, hash, vaultAddress, toast, onOpenChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    const selectedVault = formData.vault || vaultAddress;
    if (!selectedVault) {
      toast({
        title: "Error",
        description: "Please select a vault",
        variant: "destructive",
      });
      return;
    }

    // Validate nominee address
    if (!formData.nominee.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Error",
        description: "Invalid nominee wallet address format",
        variant: "destructive",
      });
      return;
    }

    // Convert duration from days to seconds
    const durationSeconds = Number.parseInt(formData.duration) * 24 * 60 * 60;

    try {
      // This will save to backend immediately and initiate blockchain in background
      await createVoting(
        selectedVault as Address,
        formData.nominee as Address,
        formData.nomineeName,
        formData.role,
        formData.description,
        durationSeconds
      );

      // Close modal immediately after backend save succeeds
      // (blockchain transaction continues in background)
      setTimeout(() => {
        onOpenChange(false);
        setFormData({
          vault: vaultAddress || "",
          nominee: "",
          nomineeName: "",
          role: "",
          description: "",
          duration: "7",
        });
      }, 500);
    } catch (error) {
      // Error from backend save is already handled by toast in the hook
      console.error("Failed to create voting:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nominate Contributor</DialogTitle>
          <DialogDescription>
            Propose a contributor for higher allocation through community voting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!vaultAddress && vaultsWithNames && vaultsWithNames.length > 0 && (
            <div>
              <Label htmlFor="vault" className="mb-2 block">
                Select Vault
              </Label>
              <Select
                value={formData.vault}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    vault: value,
                    nominee: "",
                    nomineeName: "",
                    role: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vault" />
                </SelectTrigger>
                <SelectContent>
                  {vaultsWithNames.map((vault) => (
                    <SelectItem key={vault.address} value={vault.address}>
                      {vault.name} ({vault.address.slice(0, 6)}...
                      {vault.address.slice(-4)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedVault && (
            <div>
              <Label htmlFor="contributor" className="mb-2 block">
                Select Contributor
              </Label>
              {isLoadingContributors ? (
                <div className="p-2 border rounded-lg bg-muted text-sm text-foreground/70">
                  Loading contributors...
                </div>
              ) : activeContributors.length === 0 ? (
                <div className="p-2 border rounded-lg bg-muted text-sm text-foreground/70">
                  No active contributors found for this vault. Please add
                  contributors first.
                </div>
              ) : (
                <Select
                  value={formData.nominee}
                  onValueChange={handleContributorSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a contributor" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeContributors.map((contributor) => (
                      <SelectItem
                        key={contributor.wallet}
                        value={contributor.wallet}
                      >
                        {contributor.name || "Unnamed"} -{" "}
                        {contributor.role || "No role"} (
                        {contributor.wallet.slice(0, 6)}...
                        {contributor.wallet.slice(-4)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {formData.nominee && (
            <>
              <div>
                <Label htmlFor="nomineeName" className="mb-2 block">
                  Contributor Name
                </Label>
                <Input
                  id="nomineeName"
                  value={formData.nomineeName}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="nominee" className="mb-2 block">
                  Contributor Wallet Address
                </Label>
                <Input
                  id="nominee"
                  value={formData.nominee}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="role" className="mb-2 block">
                  Role
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="description" className="mb-2 block">
              Reason for Nomination
            </Label>
            <textarea
              id="description"
              placeholder="Describe why this contributor deserves higher allocation..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground resize-none h-24"
            />
          </div>

          <div>
            <Label htmlFor="duration" className="mb-2 block">
              Voting Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="7"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              min="1"
              max="30"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !formData.vault ||
                !formData.nominee ||
                !formData.description ||
                activeContributors.length === 0
              }
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isPending ? "Confirming..." : "Submit Nomination"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
