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
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.music = this.sys.game.globals.music
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.guiManager = new GuiManager(this)

		this.keyboardManager.unpauseGame()
		this.keyboardManager.MuteGame()
		this.keyboardManager.titleScreen()
	}
	update() {
		// update for mute and sound button
		// if (this.music.musicOn === false && this.music.soundOn === false) {
		// 	this.musicButton = this.add.image(config.width - 60, 30, 'mute_texture')
		// } else if (this.music.musicOn === true && this.music.soundOn === true) {
		// 	this.musicButton = this.add.image(config.width - 60, 30, 'sound_texture')
		// }
	}

	updateAudio() {
		if (this.music.musicOn === false && this.music.soundOn === false) {
			this.musicButton.setTexture('mute_texture')
			this.sys.game.globals.bgMusic.pause()
			this.music.bgMusicPlaying = false
		} else if (this.music.musicOn === true && this.music.soundOn === true) {
			this.musicButton.setTexture('sound_texture')
			if (this.music.bgMusicPlaying === false) {
				this.sys.game.globals.bgMusic.resume()
				this.music.bgMusicPlaying = true
			}
		}
	}
}
export default PauseScreen
