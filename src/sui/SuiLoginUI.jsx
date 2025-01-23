import React, { useState, useEffect, useRef } from 'react'
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
	'0x4e3c52b995cc807025ee73b884d808c08c4f68533c9b1a37af62725a3feb2146'

const SuiLoginUI = () => {
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
			gameSettings.userWalletAdress = currentAccount.address
			EventBus.emit('wallet-connected', { connected: true })
		} else {
			gameSettings.userActive = false
			gameSettings.userWalletAdress = ''
			EventBus.emit('wallet-connected', { connected: false })
		}
	}, [currentAccount])

	useEffect(() => {
		const handleSceneReady = (eventData) => {
			console.log('Event data:', eventData)

			if (currentAccount) {
				gameSettings.userActive = true
				gameSettings.userWalletAdress = currentAccount.address
				EventBus.emit('wallet-connected', {
					connected: true,
				})
			} else {
				gameSettings.userActive = false
				gameSettings.userWalletAdress = ''
				EventBus.emit('wallet-connected', {
					connected: false,
				})
			}

			if (
				eventData &&
				eventData.key &&
				eventData.key.callingScene === 'mintingScreen'
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
					txb.pure.string(url),
					txb.pure.string(frame),
					txb.object('0x8'),
					betAmountCoin,
					txb.object(
						'0xd624c06612c96e33827a15ae361b0e224e1015cd83d3ed5875b15ef9ac690247', // NFT Shop address
					),
					txb.object(
						'0x69e362bd7b8a566cdba86da661c040d47663db28df773c43cc97c8158173b3c6', // NFT Counter address
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

export default SuiLoginUI
