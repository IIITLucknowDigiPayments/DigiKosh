import { Request, Response } from 'express'
import { Contributor } from '../models/Contributor'
import { contractService } from '../services/contractService'

export class ContributorController {
	async getVaultContributors(req: Request, res: Response) {
		try {
			const { vaultAddress } = req.params
			let contributors = await Contributor.find({ vault: vaultAddress, isActive: true })

			// If not in DB, fetch from contract
			if (contributors.length === 0) {
				const contributorAddresses = await contractService.getVaultContributors(vaultAddress)
				for (const address of contributorAddresses) {
					const contributorInfo = await contractService.getContributor(vaultAddress, address)
					const contributor = await Contributor.create({
						vault: vaultAddress,
						wallet: address,
						...contributorInfo,
					})
					contributors.push(contributor)
				}
			}

			console.log(`Fetched ${contributors.length} contributors for vault ${vaultAddress}`)
			console.log('Contributors:', contributors)
			res.json({ success: true, data: contributors })
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message })
		}
	}

	async getAllContributors(req: Request, res: Response) {
		try {
			const contributors = await Contributor.find({ isActive: true }).sort({ createdAt: -1 })
			res.json({ success: true, data: contributors })
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message })
		}
	}

	async createContributor(req: Request, res: Response) {
		console.log('Received request to create contributor:', req.body)
        try {
            const { vault, wallet, name, role, monthlyAllocation, totalEarned, isActive } = req.body

            // Basic validation
            if (!vault || !wallet || !name || !role) {
                return res.status(400).json({ success: false, error: 'vault, wallet, name and role are required' })
            }

            // Upsert contributor (create if not exists, update otherwise)
            // const contributor = await Contributor.create(
            //     {
            //         vault,
            //         wallet,
            //         name,
            //         role,
            //         monthlyAllocation: monthlyAllocation ?? '0',
            //         totalEarned: totalEarned ?? '0',
            //         isActive: typeof isActive === 'boolean' ? isActive : true,
            //     }
            // )

            const contributor = await Contributor.findOneAndUpdate(
				{ vault, wallet },
                {
					vault,
                    wallet,
                    name,
                    role,
                    monthlyAllocation: monthlyAllocation ?? '0',
                    totalEarned: totalEarned ?? '0',
                    isActive: typeof isActive === 'boolean' ? isActive : true,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
			
			console.log('Contributor created successfully:', contributor)
            return res.status(201).json({ success: true, data: contributor })
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message })
        }
    }
}

export const contributorController = new ContributorController()

