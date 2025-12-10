"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { useAddContributor } from "@/hooks/use-write-contracts";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { useVaultContributors } from "@/hooks/use-contributors";
import { useApiContributors } from "@/hooks/use-api";

interface AddContributorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultAddress?: string;
}

export function AddContributorModal({
  open,
  onOpenChange,
  vaultAddress,
}: AddContributorModalProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const router = useRouter();
  const { addContributor, isPending, isSuccess, hash } = useAddContributor();
  const { refetch: refetchContractContributors } = useVaultContributors(
    vaultAddress as Address | undefined
  );
  const { refetch: refetchApiContributors } = useApiContributors(
    vaultAddress as Address | undefined
  );
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    wallet: "",
    monthlyAllocation: "",
  });

  useEffect(() => {
    if (hash && !isPending && !isSuccess && vaultAddress) {
      // Blockchain transaction failed
      toast({
        title: "Transaction Failed",
        description:
          "The blockchain transaction was reverted. The contributor was added to backend but not confirmed on-chain.",
        variant: "destructive",
      });
      // Don't close modal - user can see the error
      return;
    }

    if (isSuccess && vaultAddress) {
      // Blockchain transaction succeeded
      toast({
        title: "Success",
        description: "Contributor confirmed on blockchain!",
      });

      // Clear form and close modal after 1 second
      setTimeout(() => {
        onOpenChange(false);
        setFormData({ name: "", role: "", wallet: "", monthlyAllocation: "" });
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

    if (!vaultAddress) {
      toast({
        title: "Error",
        description: "Please select a vault first",
        variant: "destructive",
      });
      return;
    }

    // Validate wallet address
    if (!formData.wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Error",
        description: "Invalid wallet address format",
        variant: "destructive",
      });
      return;
    }

    try {
      // This will save to backend immediately and initiate blockchain in background
      await addContributor(
        vaultAddress as Address,
        formData.wallet as Address,
        formData.name,
        formData.role,
        formData.monthlyAllocation
      );

      // Close modal immediately after backend save succeeds
      // (blockchain transaction continues in background)
      toast({
        title: "Contributor Added",
        description: "Contributor has been added successfully!",
      });

      setTimeout(() => {
        onOpenChange(false);
        setFormData({ name: "", role: "", wallet: "", monthlyAllocation: "" });
      }, 500);
    } catch (error) {
      // Error from backend save is already handled by toast in the hook
      console.error("Failed to add contributor:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contributor</DialogTitle>
          <DialogDescription>
            Add a new team member to receive yield allocations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Alex Chen"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="role" className="mb-2 block">
              Role
            </Label>
            <Input
              id="role"
              placeholder="e.g., Lead Developer"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="wallet" className="mb-2 block">
              Wallet Address
            </Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={formData.wallet}
              onChange={(e) =>
                setFormData({ ...formData, wallet: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="allocation" className="mb-2 block">
              Monthly Allocation (USDC)
            </Label>
            <Input
              id="allocation"
              type="number"
              placeholder="2000"
              value={formData.monthlyAllocation}
              onChange={(e) =>
                setFormData({ ...formData, monthlyAllocation: e.target.value })
              }
              step="100"
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
                !vaultAddress ||
                !formData.name ||
                !formData.role ||
                !formData.wallet ||
                !formData.monthlyAllocation
              }
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isPending ? "Confirming..." : "Add Contributor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
