import Phaser from 'phaser'
import GuiManager from '../manager/GuiManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import InterfaceManager from './InterfaceScene.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'

class GameOver extends Phaser.Scene {
	constructor() {
		super('gameOver')
	}

	init(data) {
		this.callingScene = data.key
	}

	preload() {
		// Default Set up Code
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

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
		EventBus.on('wallet-connected', handleWalletConnected, this)

		// Initialize InterfaceManager
		this.interfaceManager = new InterfaceManager(this)
		// ===============================================================

		// Transition to NFTGenerate scene to generate the NFT properties
		this.interfaceManager.goToNFTGenerate(3000)

		// ===============================================================
		// Add a game over message
		this.keyboardManager = new KeyboardManager(this)
		this.guiManager = new GuiManager(this)
		this.interfaceManager = new InterfaceManager(this)
		// Define the "R", "T", "L" key
		this.keyboardManager.restartGame()
		this.keyboardManager.menuScreen()
		// this.keyboardManager.showLeaderboard()
	}
}

export default GameOver
