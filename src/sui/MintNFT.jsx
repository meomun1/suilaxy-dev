import React, { useState, useEffect } from 'react'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'

import { useRef } from 'react'

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

	// Only when it is after the choose player scene, which is the tutorial scene
	// Use EventBus to emit the event
	useEffect(() => {
		const handleSceneReady = (eventData) => {
			console.log('Event data received:', eventData)

			if (
				eventData &&
				eventData.key &&
				eventData.key.callingScene === 'playTutorial'
			) {
				phaserRef.current = eventData.key.callingScene
				const { name, frame, description, url } = eventData.nftProperties
				setName(name)
				setDescription(description)
				setUrl(url)
				setFrame(frame)
				console.log('NFT Properties:', name, frame, description, url)
			} else {
				console.error('Invalid event data:', eventData)
			}
		}

		EventBus.on('current-scene-ready', handleSceneReady)

		return () => {
			EventBus.off('current-scene-ready', handleSceneReady)
		}
	}, [])

	const handleMint = async () => {
		try {
			if (!currentAccount) {
				throw new Error('No account connected')
			}

			if (!name || !description || !url || !frame) {
				throw new Error('All fields are required')
			}

			console.log('Name:', name)
			console.log('Description:', description)
			console.log('Frame:', frame)
			console.log('URL:', url)

			// Create a new transaction block
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

			// Sign and execute the transaction block using the current account's keypair
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
			console.error('Complete Error:', err)
		}
	}

	return (
		<div style={{ padding: 20 }}>
			<ConnectButton />
			{currentAccount && (
				<>
					<button onClick={handleMint}>Mint NFT</button>
					{digest && <p>NFT minted successfully! Transaction: {digest}</p>}
					{error && <p>Error: {error}</p>}
				</>
			)}
		</div>
	)
}

export default MintNFT
