import React, { useState, useEffect, useRef } from 'react'
// import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Transaction } from '@mysten/sui/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
	useSuiClientQuery,
} from '@mysten/dapp-kit'
import { EventBus } from '../game/EventBus'
import { saveAs } from 'file-saver'
import gameSettings from '../game/config/gameSettings'
import { MIST_PER_SUI } from '@mysten/sui/utils'

const PACKAGE_ADDRESS =
	'0xfae5d009427d16e6e8d36d62feaa4818ac1fc428eacf007d4ba6c0e43a0edb76'

const MintNFT = () => {
	const [name, setName] = useState('')
	const [frame, setFrame] = useState('')
	const [description, setDescription] = useState('')
	const [url, setUrl] = useState('')
	const [digest, setDigest] = useState('')
	const [error, setError] = useState(null)

	const phaserRef = useRef()
	const currentAccount = useCurrentAccount()

	// My changes
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: currentAccount?.address,
	})
	// if (data) {
	// 	console.log(data)
	// }

	const { mutate: signAndExecuteTransaction } =
		useSignAndExecuteTransactionBlock()

	useEffect(() => {
		if (currentAccount) {
			gameSettings.userActive = true
			EventBus.emit('wallet-connected', { connected: true })
		} else {
			gameSettings.userActive = false
			EventBus.emit('wallet-connected', { connected: false })
		}
	}, [currentAccount])

	useEffect(() => {
		const handleSceneReady = (eventData) => {
			if (currentAccount) {
				gameSettings.userActive = true
				EventBus.emit('wallet-connected', {
					connected: true,
				})
			} else {
				gameSettings.userActive = false
				EventBus.emit('wallet-connected', {
					connected: false,
				})
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

			const txb = new Transaction()
			const sender = currentAccount.address
			txb.setSender(sender)

			const betAmountCoin = txb.splitCoins(txb.gas, [200000000])

			// Ensure betAmountCoin is valid
			if (!betAmountCoin) {
				throw new Error('Failed to create betAmountCoin')
			}

			txb.moveCall({
				target: `${PACKAGE_ADDRESS}::suilaxy_nft::send_nft_to_sender`,
				arguments: [
					txb.pure.string(name),
					txb.pure.string(description),
					txb.pure.string(
						'https://bafybeidjrifa7it76rqmcdgv5ojai3q36kminls6qbeik2joeb6m2ogmia.ipfs.w3s.link/0/0.png',
					),
					txb.pure.string('Legendary'),
					txb.object('0x8'),
					betAmountCoin,
					txb.object(
						'0xd1fdd055f11781f08338cfa04ea7318197b46a8ae4f689a58a7a132b75d75f9b',
					),
					txb.object(
						'0xc9a0efe52748a12d355103b33456e3c1dbc0a7a44dba07d760d05673e60d29f2',
					),
				],
			})

			console.log('Transaction:', txb)

			signAndExecuteTransaction(
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

	return <ConnectButton />
}

export default MintNFT
