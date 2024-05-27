import React, { useState } from 'react'
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

// Initialize Sui client
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') })

const keypair = Ed25519Keypair.generate()

const MintNFT = () => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [url, setUrl] = useState('')
	const [txResult, setTxResult] = useState(null)
	const [error, setError] = useState(null)

	const handleMint = async () => {
		try {
			if (!name || !description || !url) {
				throw new Error('All fields are required')
			}

			console.log('Name:', name)
			console.log('Description:', description)
			console.log('URL:', url)

			// Create a new transaction block
			const txb = new TransactionBlock()
			const sender = keypair.getPublicKey().toSuiAddress()
			txb.setSender(sender)
			console.log('Sender:', sender) // Print out the sender address
			txb.moveCall({
				target:
					'0x6eaaeb29ff4f946d0fb5b6ddd5dee6c50d13b036dbca79656aa58248b8492c51::suilaxy_nft::mint_to_sender',
				arguments: [txb.pure(name), txb.pure(description), txb.pure(url)],
			})

			// Sign the transaction block
			const signedTxn = await txb.sign({
				client: suiClient,
				signer: keypair,
			})

			// Log signed transaction details
			console.log('Signed Transaction:', signedTxn)

			// Execute the transaction block
			const result = await suiClient.executeTransactionBlock({
				transactionBlock: signedTxn.bytes,
				signature: signedTxn.signature,
				requestType: 'WaitForLocalExecution',
				options: {
					showEffects: true,
				},
			})

			setTxResult(result)
			console.log('Transaction Result:', result)
		} catch (err) {
			setError(err.message)
			console.error('Failed to mint NFT:', err)
			console.error('Complete Error:', err)
		}
	}

	return (
		<div>
			<h2>Mint Your NFT</h2>
			<input
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
			/>
			<button onClick={handleMint}>Mint NFT</button>
			{txResult && (
				<p>NFT minted successfully! Transaction: {txResult.digest}</p>
			)}
			{error && <p>Error: {error}</p>}
		</div>
	)
}

export default MintNFT
