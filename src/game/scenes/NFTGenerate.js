import Phaser from 'phaser'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { postScore } from '../api/gameScore.js'
import InterfaceManager from './InterfaceScene.js'

class NFTGenerate extends Phaser.Scene {
	constructor() {
		super('nftGenerate')
	}

	init(data) {
		this.callingScene = data.key
	}

	preload() {
		// Default Set up Code
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		// Load the NFT mapping data
		this.load.json('nftMapping', '../src/data/nft_mapping.json')
	}

	create() {
		// ===============================================================
		EventBus.on('wallet-connected', handleWalletConnected, this)

		// Initialize InterfaceManager
		this.interfaceManager = new InterfaceManager(this)

		const searchText = this.add.text(
			this.cameras.main.centerX,
			this.cameras.main.centerY - 50,
			'<Saving your record>',
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '32px',
				fill: '#FFFFFF',
			},
		)
		searchText.setOrigin(0.5)

		// ===============================================================
		// Post the score to the mockapi
		postScore(gameSettings.userWalletAdress, gameSettings.playerScore)

		// Generate the NFT properties
		const nftProperties = this.generateNFTProperties()

		// Set the NFT properties to the game settings
		gameSettings.nft_weapon = nftProperties.name
		gameSettings.nft_frame = nftProperties.frame
		gameSettings.nft_description = nftProperties.description
		gameSettings.nft_img_url = nftProperties.url
		// ===============================================================

		// Delay logic to simulate searching
		this.time.delayedCall(
			2000, // 2 seconds delay
			() => {
				searchText.destroy()
				this.interfaceManager.goToNFTMint(1000)
			},
			null,
			this,
		)
	}

	randomNFTFrameIndex(score) {
		if (score < 1000) {
			return 0
		} else if (score >= 4000 && score < 8000) {
			return Phaser.Math.Between(0, 2)
		} else if (score >= 8000 && score < 10000) {
			return Phaser.Math.Between(0, 3)
		} else if (score >= 10000 && score < 12000) {
			return Phaser.Math.Between(0, 4)
		} else if (score >= 12000 && score < 14000) {
			return Phaser.Math.Between(1, 5)
		} else if (score >= 14000 && score < 15000) {
			return Phaser.Math.Between(2, 6)
		} else if (score >= 15000 && score < 16000) {
			return Phaser.Math.Between(3, 7)
		} else if (score >= 16000) {
			return Phaser.Math.Between(4, 8)
		}
		return 0
	}

	randomNFTIndex() {
		return Phaser.Math.Between(0, 9)
	}

	generateNFTProperties() {
		const nftMapping = this.cache.json.get('nftMapping')
		gameSettings.nft_weapon_index = this.randomNFTIndex()
		gameSettings.nft_frame_index = this.randomNFTFrameIndex(
			gameSettings.playerScore,
		)

		const selectedNFT = nftMapping[gameSettings.nft_weapon_index]
		const selectedFrame = selectedNFT.url[gameSettings.nft_frame_index]

		return {
			name: selectedNFT.name,
			frame: selectedFrame.frame,
			description: selectedNFT.description,
			url: selectedFrame.image,
		}
	}
}

export default NFTGenerate
