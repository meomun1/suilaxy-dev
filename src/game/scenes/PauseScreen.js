import Phaser from 'phaser'
import config from '../config/config'
import KeyboardManager from '../manager/KeyboardManager.js'
import GuiManager from '../manager/GuiManager.js'
import Button from '../objects/Button.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'

class PauseScreen extends Phaser.Scene {
	constructor() {
		super('pauseScreen')
	}
	preload() {
		this.load.image('resume', 'assets/spritesheets/vfx/resume.png')
	}

	init(data) {
		this.callingScene = data.key
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.music = this.sys.game.globals.music
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.guiManager = new GuiManager(this)

		this.keyboardManager.unpauseGame()
		this.keyboardManager.MuteGame()
		this.keyboardManager.menuScreen()
	}
}
export default PauseScreen
