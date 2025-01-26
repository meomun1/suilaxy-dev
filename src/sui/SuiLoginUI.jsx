import { useState, useEffect, useRef, useCallback } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
	useSuiClientQuery,
} from '@mysten/dapp-kit'
import { EventBus } from '../game/EventBus'
import gameSettings from '../game/config/gameSettings'

const PACKAGE_ADDRESS =
	'0x4e3c52b995cc807025ee73b884d808c08c4f68533c9b1a37af62725a3feb2146'
const DONATION_ADDRESS =
	'0xa84a74d18762c8981749f539849f72888ffe554069d6b37451aff73d6c20c171'

const SuiLoginUI = () => {
	const [canMint, setCanMint] = useState(false)
	const [nftState, setNftState] = useState({
		name: '',
		frame: '',
		description: '',
		url: '',
		digest: '',
		error: null,
	})

	const phaserRef = useRef()
	const currentAccount = useCurrentAccount()
	const { mutate: signAndExecuteTransaction } =
		useSignAndExecuteTransactionBlock()

	const { data: ownedObjects } = useSuiClientQuery(
		'getOwnedObjects',
		{
			owner: currentAccount?.address,
		},
		{
			enabled: !!currentAccount?.address,
		},
	)

	useEffect(() => {
		const isConnected = !!currentAccount
		gameSettings.userActive = isConnected
		gameSettings.userWalletAdress = currentAccount?.address || ''
		EventBus.emit('wallet-connected', { connected: isConnected })
	}, [currentAccount])

	const validateNFTProperties = () => {
		const { nft_weapon, nft_description, nft_img_url, nft_frame } = gameSettings

		if (!nft_weapon || !nft_description || !nft_img_url || !nft_frame) {
			throw new Error('Missing NFT properties')
		}

		return {
			name: nft_weapon,
			description: nft_description,
			url: nft_img_url,
			frame: nft_frame,
		}
	}

	const handleMint = useCallback(async () => {
		try {
			if (!currentAccount) {
				throw new Error('No account connected')
			}

			if (!canMint) {
				throw new Error('Minting not available in current scene')
			}

			const nftProps = validateNFTProperties()

			const txb = new Transaction()
			txb.setSender(currentAccount.address)

			const betAmountCoin = txb.splitCoins(txb.gas, [200000000])
			if (!betAmountCoin) {
				throw new Error('Failed to create transaction coin')
			}

			txb.moveCall({
				target: `${PACKAGE_ADDRESS}::suilaxy_nft::send_nft_to_sender`,
				arguments: [
					txb.pure.string(nftProps.name),
					txb.pure.string(nftProps.description),
					txb.pure.string(nftProps.url),
					txb.pure.string(nftProps.frame),
					txb.object('0x8'),
					betAmountCoin,
					txb.object(
						'0xd624c06612c96e33827a15ae361b0e224e1015cd83d3ed5875b15ef9ac690247',
					),
					txb.object(
						'0x69e362bd7b8a566cdba86da661c040d47663db28df773c43cc97c8158173b3c6',
					),
				],
			})

			await signAndExecuteTransaction(
				{
					transactionBlock: txb,
					chain: 'sui:mainnet',
				},
				{
					onSuccess: (result) => {
						setNftState((prev) => ({
							...prev,
							digest: result.digest,
							error: null,
						}))
						EventBus.emit('mint-success', { digest: result.digest })
						console.log('Transaction successful:', result)
					},
					onError: (error) => {
						setNftState((prev) => ({ ...prev, error: error.message }))
						EventBus.emit('mint-error', { error: error.message })
						console.error('Mint failed:', error)
					},
				},
			)
		} catch (error) {
			setNftState((prev) => ({ ...prev, error: error.message }))
			EventBus.emit('mint-error', { error: error.message })
			console.error('Mint error:', error)
		}
	}, [currentAccount, signAndExecuteTransaction, canMint])

	const handleDonation = useCallback(
		async (donationAmountMist) => {
			try {
				if (!currentAccount) throw new Error('No account connected')

				const txb = new Transaction()
				txb.setSender(currentAccount.address)
				txb.setGasBudget(10000000)

				const donationCoin = txb.splitCoins(txb.gas, [donationAmountMist])
				txb.transferObjects([donationCoin], txb.pure.address(DONATION_ADDRESS))

				await signAndExecuteTransaction(
					{
						transactionBlock: txb,
						chain: 'sui:testnet',
						options: { showEffects: true, showEvents: true },
					},
					{
						onSuccess: (result) => {
							EventBus.emit('donation-success', {
								amount: donationAmountMist,
								digest: result.digest,
							})
						},
						onError: (error) => {
							EventBus.emit('donation-error', { error: error.message })
						},
					},
				)
			} catch (error) {
				EventBus.emit('donation-error', { error: error.message })
			}
		},
		[currentAccount, signAndExecuteTransaction],
	)

	useEffect(() => {
		const handleSceneReady = (eventData) => {
			if (eventData?.key?.callingScene === 'mintingScreen') {
				setCanMint(true)
				phaserRef.current = eventData.key.callingScene

				// Update NFT state when entering minting screen
				const { name, frame, description, url } = eventData.nftProperties
				setNftState((prev) => ({
					...prev,
					name: name || '',
					frame: frame || '',
					description: description || '',
					url: url || '',
				}))
			} else {
				setCanMint(false)
			}
		}

		const eventHandlers = {
			'current-scene-ready': handleSceneReady,
			'mint-nft-clicked': handleMint,
			'process-donation': (data) => handleDonation(data.amount),
		}

		// Register all event handlers
		Object.entries(eventHandlers).forEach(([event, handler]) => {
			EventBus.on(event, handler)
		})

		// Cleanup function
		return () => {
			Object.entries(eventHandlers).forEach(([event, handler]) => {
				EventBus.off(event, handler)
			})
		}
	}, [handleMint, handleDonation])

	return <ConnectButton />
}

export default SuiLoginUI
