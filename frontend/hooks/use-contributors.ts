'use client'

import { useReadContract } from 'wagmi'
import { useContributorRegistry } from './use-contracts'
import { Address } from 'viem'
import { useCallback, useEffect, useState } from 'react'

export interface Contributor {
	vault: Address
	wallet: Address
	name: string
	role: string
	monthlyAllocation: bigint
	totalEarned: bigint
	isActive: boolean
}

export function useVaultContributors(vaultAddress?: Address) {
	const { address: registryAddress, abi } = useContributorRegistry()
	
	const { data: result, isLoading, refetch } = useReadContract({
		address: registryAddress,
		abi,
		functionName: 'getVaultContributors',
		args: vaultAddress ? [vaultAddress] : undefined,
		query: {
			enabled: !!vaultAddress,
			refetchInterval: 5000, // Refetch every 5 seconds to catch new contributors
		},
	})

	// getVaultContributors returns a tuple: (address[] wallets, Contributor[] contributorData)
	// When wagmi/viem returns a tuple, it's an array: [wallets, contributorData]
	let wallets: Address[] | undefined = undefined
	let contributorData: Contributor[] | undefined = undefined

	if (result) {
		if (Array.isArray(result) && result.length === 2) {
			// It's a tuple: [wallets, contributorData]
			wallets = result[0] as Address[]
			contributorData = result[1] as Contributor[]
		} else if (Array.isArray(result)) {
			// Fallback: assume it's just the wallets array
			wallets = result as Address[]
		}
	}

	// Backend fallback state (fetch when contract returns nothing)
	const [backendWallets, setBackendWallets] = useState<Address[] | undefined>(undefined)
	const [isLoadingBackend, setIsLoadingBackend] = useState(false)

	const fetchBackendContributors = useCallback(async (vault?: Address) => {
		if (!vault) {
			setBackendWallets(undefined)
			return
		}
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
		setIsLoadingBackend(true)
		try {
			const res = await fetch(`${apiBase}/contributors/vault/${vault}`)
			const json = await res.json()
			if (res.ok && json.success && Array.isArray(json.data)) {
				const walletsFromBackend = json.data.map((c: any) => (c.wallet as Address))
				setBackendWallets(walletsFromBackend)
			} else {
				setBackendWallets([])
			}
		} catch (err) {
			setBackendWallets([])
		} finally {
			setIsLoadingBackend(false)
		}
	}, [])

	// Fetch backend contributors when vault changes and contract list is missing/empty
	useEffect(() => {
		if (!vaultAddress) {
			setBackendWallets(undefined)
			return
		}

		// If contract returned no wallets (undefined or empty), fetch backend
		if (!wallets || (Array.isArray(wallets) && wallets.length === 0)) {
			fetchBackendContributors(vaultAddress)
		} else {
			// we have contract wallets, clear backend fallback
			setBackendWallets(undefined)
		}
	}, [vaultAddress, wallets, fetchBackendContributors])

	// provide a refetch that refreshes both contract and backend sources
	const refetchAll = useCallback(async () => {
		await refetch?.()
		await fetchBackendContributors(vaultAddress)
	}, [refetch, fetchBackendContributors, vaultAddress])

	const finalWallets = (wallets && wallets.length > 0) ? wallets : backendWallets

	return {
		contributors: finalWallets,
		contributorData,
		isLoading: isLoading || isLoadingBackend,
		refetch: refetchAll,
	}
}

export function useContributorInfo(vaultAddress: Address, contributorAddress: Address) {
	const { address: registryAddress, abi } = useContributorRegistry()
	
	const { data: contributor, isLoading } = useReadContract({
		address: registryAddress,
		abi,
		functionName: 'getContributor',
		args: [vaultAddress, contributorAddress],
	})

	return {
		contributor: contributor as Contributor | undefined,
		isLoading,
	}
}

export function useTotalMonthlyAllocation(vaultAddress?: Address) {
	const { address: registryAddress, abi } = useContributorRegistry()
	
	const { data: totalAllocation, isLoading } = useReadContract({
		address: registryAddress,
		abi,
		functionName: 'getTotalMonthlyAllocation',
		args: vaultAddress ? [vaultAddress] : undefined,
		query: {
			enabled: !!vaultAddress,
		},
	})

	return {
		totalAllocation: totalAllocation as bigint | undefined,
		isLoading,
	}
}

