import Phaser from 'phaser'
import GuiManager from '../manager/GuiManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import InterfaceManager from './InterfaceScene.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { resetSaveStatsToBaseStats } from '../utils/adjustStats.js'

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

		// Reset stats
		resetSaveStatsToBaseStats()
	}
}

export default GameOver
