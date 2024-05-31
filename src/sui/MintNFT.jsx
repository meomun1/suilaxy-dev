import React, { useState, useEffect, useRef } from 'react'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'
import { EventBus } from '../game/EventBus'

const PACKAGE_ADDRESS =
	'0xdf295d1b88035db4a8c308ede33088e8c5df24d27f0448e41df2b8175afdae49'

const MintNFT = () => {
	const [name, setName] = useState('')
	const [frame, setFrame] = useState('')
	const [description, setDescription] = useState('')
	const [url, setUrl] = useState('')
	const [digest, setDigest] = useState('')
	const [error, setError] = useState(null)

	const phaserRef = useRef()
	const currentAccount = useCurrentAccount()

	const { mutate: signAndExecuteTransactionBlock } =
		useSignAndExecuteTransactionBlock()

	useEffect(() => {
		if (currentAccount) {
			EventBus.emit('wallet-connected', { connected: true })
		} else {
			EventBus.emit('wallet-connected', { connected: false })
		}
	}, [currentAccount])

	useEffect(() => {
		const handleSceneReady = (eventData) => {
			if (currentAccount) {
				EventBus.emit('wallet-connected', { connected: true })
			} else {
				EventBus.emit('wallet-connected', { connected: false })
			}

			if (
				eventData &&
				eventData.key &&
				eventData.key.callingScene === 'createNft'
			) {
				phaserRef.current = eventData.key.callingScene
				const { name, frame, description, url } = eventData.nftProperties
				setName(name || '')
				setDescription(description || '')
				setUrl(url || '')
				setFrame(frame || '')
			} else {
				console.error('Invalid event data:', eventData)
			}
		}

		const handleMintClicked = () => {
			handleMint(name, description, frame, url)
		}

		EventBus.on('current-scene-ready', handleSceneReady)
		EventBus.on('mint-nft-clicked', handleMintClicked)

		return () => {
			EventBus.off('current-scene-ready', handleSceneReady)
			EventBus.off('mint-nft-clicked', handleMintClicked)
		}
	}, [currentAccount, name, description, frame, url])

	const handleMint = async (name, description, frame, url) => {
		try {
			if (!currentAccount) {
				throw new Error('No account connected')
			}

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

			const txb = new TransactionBlock()
			const sender = currentAccount.address
			txb.setSender(sender)

			txb.moveCall({
				target: `${PACKAGE_ADDRESS}::suilaxy_nft::mint_to_sender`,
				arguments: [
					txb.pure(name),
					txb.pure(description),
					txb.pure(frame),
					txb.pure(url),
				],
			})

			signAndExecuteTransactionBlock(
				{
					transactionBlock: txb,
					chain: 'sui:testnet',
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
	}

	return (
		<div>
			<ConnectButton />
		</div>
	)
}

export default MintNFT
