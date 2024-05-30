import React, { useState } from 'react'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit'

import { useRef } from 'react'

import gameSettings from '../game/config/gameSettings'

// Placeholder for the correct package address
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

	// After the choose player scene, get the NFTs properties
	const getNFTProperties = () => {
		const name = gameSettings.nft_weapon
		const frame = gameSettings.nft_frame
		const description = gameSettings.nft_description
		const url = gameSettings.nft_img_url

		if (true) {
			setName(name)
			setFrame(frame)
			setDescription(description)
			setUrl(url)
		}
	}

	const currentAccount = useCurrentAccount()
	const { mutate: signAndExecuteTransactionBlock } =
		useSignAndExecuteTransactionBlock()

	const handleMint = async () => {
		try {
			if (!currentAccount) {
				throw new Error('No account connected')
			}

			if (!name || !description || !url || !frame) {
				throw new Error('All fields are required')
			}

			console.log('Name:', name)
			console.log('Frame:', frame)
			console.log('Description:', description)
			console.log('URL:', url)

			// Create a new transaction block
			const txb = new TransactionBlock()
			const sender = currentAccount.address
			txb.setSender(sender)

			console.log('Sender:', sender) // Print out the sender address

			txb.moveCall({
				target: `${PACKAGE_ADDRESS}::suilaxy_nft::mint_to_sender`,
				arguments: [
					txb.pure(name),
					txb.pure(description),
					txb.pure(url),
					txb.pure(frame),
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
					{/* <input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						type="text"
						placeholder="URL"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/> */}
					<button onClick={getNFTProperties}>Get NFT Props</button>
					<button onClick={handleMint}>Mint NFT</button>
					{digest && <p>NFT minted successfully! Transaction: {digest}</p>}
					{error && <p>Error: {error}</p>}
				</>
			)}
		</div>
	)
}

export default MintNFT
