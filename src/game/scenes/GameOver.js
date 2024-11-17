import Phaser from 'phaser'
import GuiManager from '../manager/GuiManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import InterfaceManager from './InterfaceScene.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import axios from 'axios'

class GameOver extends Phaser.Scene {
	constructor() {
		super('gameOver')
	}

	init(data) {
		this.callingScene = data.key
	}

	preload() {
		this.load.json('nftMapping', '../src/data/nft_mapping.json')

		// this.load.spritesheet({
		// 	key: 'button_continue_hover',
		// 	url: 'assets/gui/button_play_hover.png',
		// 	frameConfig: {
		// 		frameWidth: 93,
		// 		frameHeight: 28,
		// 		startFrame: 3,
		// 		endFrame: 3,
		// 	},
		// })
		// this.load.spritesheet({
		// 	key: 'button_continue',
		// 	url: 'assets/gui/button_play.png',
		// 	frameConfig: {
		// 		frameWidth: 93,
		// 		frameHeight: 28,
		// 		startFrame: 3,
		// 		endFrame: 3,
		// 	},
		// })
	}

	create() {
		// ===============================================================
		// Default Set up Code
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		EventBus.on('wallet-connected', handleWalletConnected, this)

		// ===============================================================
		// Post the score to the mockapi
		this.postScore()
		// Generate the NFT properties
		const nftProperties = this.generateNFTProperties()
		console.log('NFT properties:', nftProperties)

		// ===============================================================
		// Check if the boss is dead
		gameSettings.isBossDead = true
		// Add a game over message
		this.keyboardManager = new KeyboardManager(this)
		this.guiManager = new GuiManager(this)
		this.interfaceManager = new InterfaceManager(this)
		// Define the "R", "T", "L" key
		this.keyboardManager.restartGame()
		this.keyboardManager.titleScreen()
		this.keyboardManager.showLeaderboard()
	}

	postScore() {
		try {
			axios.post('https://66f3fc9a77b5e8897097cb44.mockapi.io/api/scores', {
				score: gameSettings.playerScore,
				walletAddress: gameSettings.userWalletAdress,
			})
		} catch (error) {
			console.error('Error posting score:', error)
		}
	}

	randomNFTFrameIndex(score) {
		if (score < 1000) {
			return 0
		} else if (score >= 4000 && score < 8000) {
			return Phaser.Math.Between(0, 2)
		} else if (score >= 8000 && score < 10000) {
			return Phaser.Math.Between(1, 3)
		} else if (score >= 10000 && score < 12000) {
			return Phaser.Math.Between(1, 4)
		} else if (score >= 12000 && score < 14000) {
			return Phaser.Math.Between(3, 5)
		} else if (score >= 14000 && score < 15000) {
			return Phaser.Math.Between(3, 6)
		} else if (score >= 15000 && score < 16000) {
			return Phaser.Math.Between(5, 7)
		} else if (score >= 16000) {
			return Phaser.Math.Between(5, 8)
		}
		return 0
	}

	generateNFTProperties() {
		const nftMapping = this.cache.json.get('nftMapping')
		gameSettings.nft_weapon_index = Phaser.Math.Between(0, 9)
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

	transitionToLeaderboard() {
		this.scene.stop(this.callingScene)
		this.scene.start('mainMenu')
	}
}

export default GameOver
