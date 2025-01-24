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
	const [name, setName] = useState('')
	const [frame, setFrame] = useState('')
	const [description, setDescription] = useState('')
	const [url, setUrl] = useState('')
	const [digest, setDigest] = useState('')
	const [error, setError] = useState(null)

	const phaserRef = useRef()
	const currentAccount = useCurrentAccount()
	const { mutate: signAndExecuteTransaction } =
		useSignAndExecuteTransactionBlock()
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: currentAccount?.address,
	})

	useEffect(() => {
		if (currentAccount) {
			gameSettings.userActive = true
			gameSettings.userWalletAdress = currentAccount.address
			EventBus.emit('wallet-connected', { connected: true })
		} else {
			gameSettings.userActive = false
			gameSettings.userWalletAdress = ''
			EventBus.emit('wallet-connected', { connected: false })
		}
	}, [currentAccount])

	const handleMint = useCallback(
		async (name, description, frame, url) => {
			try {
				if (!currentAccount) throw new Error('No account connected')
				if (!name || !description || !url || !frame) {
					const missingFields = []
					if (!name) missingFields.push('name')
					if (!description) missingFields.push('description')
					if (!url) missingFields.push('url')
					if (!frame) missingFields.push('frame')
					throw new Error(
						`All fields are required. Missing fields: ${missingFields.join(
							', ',
						)}`,
					)
				}

				const txb = new Transaction()
				txb.setSender(currentAccount.address)
				const betAmountCoin = txb.splitCoins(txb.gas, [200000000])
				if (!betAmountCoin) throw new Error('Failed to create betAmountCoin')

				txb.moveCall({
					target: `${PACKAGE_ADDRESS}::suilaxy_nft::send_nft_to_sender`,
					arguments: [
						txb.pure.string(name),
						txb.pure.string(description),
						txb.pure.string(url),
						txb.pure.string(frame),
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

				signAndExecuteTransaction(
					{
						transactionBlock: txb,
						chain: 'sui:mainnet',
					},
					{
						onSuccess: (result) => {
							console.log('Executed transaction block', result)
							setDigest(result.digest)
						},
						onError: (err) => {
							setError(err.message)
							console.error('Failed to mint NFT:', err)
						},
					},
				)
			} catch (err) {
				setError(err.message)
				console.error('Failed to mint NFT:', err)
			}
		},
		[currentAccount, signAndExecuteTransaction],
	)

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
							console.log('Donation successful:', result)
							EventBus.emit('donation-success', {
								amount: donationAmountMist,
								digest: result.digest,
							})
						},
						onError: (err) => {
							console.error('Donation failed:', err)
							EventBus.emit('donation-error', { error: err.message })
						},
					},
				)
			} catch (err) {
				console.error('Donation error:', err)
				EventBus.emit('donation-error', { error: err.message })
			}
		},
		[currentAccount, signAndExecuteTransaction],
	)

	useEffect(() => {
		const handleProcessDonation = (data) => handleDonation(data.amount)
		const handleMintClicked = () => handleMint(name, description, frame, url)

		const handleSceneReady = (eventData) => {
			if (currentAccount) {
				gameSettings.userActive = true
				gameSettings.userWalletAdress = currentAccount.address
				EventBus.emit('wallet-connected', { connected: true })
			} else {
				gameSettings.userActive = false
				gameSettings.userWalletAdress = ''
				EventBus.emit('wallet-connected', { connected: false })
			}

			if (eventData?.key?.callingScene === 'mintingScreen') {
				phaserRef.current = eventData.key.callingScene
				const { name, frame, description, url } = eventData.nftProperties
				setName(name || '')
				setDescription(description || '')
				setUrl(url || '')
				setFrame(frame || '')
			}
		}

		EventBus.on('current-scene-ready', handleSceneReady)
		EventBus.on('mint-nft-clicked', handleMintClicked)
		EventBus.on('process-donation', handleProcessDonation)

		return () => {
			EventBus.off('current-scene-ready', handleSceneReady)
			EventBus.off('mint-nft-clicked', handleMintClicked)
			EventBus.off('process-donation', handleProcessDonation)
		}
	}, [
		currentAccount,
		name,
		description,
		frame,
		url,
		handleMint,
		handleDonation,
	])

	return <ConnectButton />
}

export default SuiLoginUI
