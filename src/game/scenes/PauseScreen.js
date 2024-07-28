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

		this.load.spritesheet({
			key: 'button_quit_hover',
			url: 'assets/gui/button_play_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 5,
				endFrame: 5,
			},
		})

		this.load.spritesheet({
			key: 'button_quit',
			url: 'assets/gui/button_play.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 5,
				endFrame: 5,
			},
		})
	}

	init(data) {
		this.callingScene = data.key
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.music = this.sys.game.globals.music
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.guiManager = new GuiManager(this)

		// create the resume button
		// this.pic = this.add.image(config.width - 20, 30, 'resume')
		// this.pic.setInteractive()
		// this.pic.on(
		// 	'pointerdown',
		// 	function () {
		// 		this.scene.stop()
		// 		this.scene.resume(this.callingScene)
		// 	},
		// 	this,
		// )

		// this.musicButton = this.add.image(config.width - 60, 30, 'sound_texture')

		// this.musicButton.setInteractive()
		// this.musicButton.on(
		// 	'pointerdown',
		// 	function () {
		// 		this.music.soundOn = !this.music.soundOn
		// 		this.music.musicOn = !this.music.musicOn

		// 		this.updateAudio()
		// 	},
		// 	this,
		// )

		this.buttonQuit = this.add.sprite(
			config.width / 2,
			(2 * config.height) / 3,
			'button_quit',
			0,
		)
		this.buttonQuit.setInteractive()

		this.buttonQuit.on('pointerdown', () => {
			this.scene.start('bootGame')
			let otherScene = this.scene.get(this.callingScene)
			otherScene.shutdownPlayer()
			this.scene.stop(this.callingScene)
			this.scene.stop('pauseScreen')
			gameSettings.playerScore = 0
			this.sys.game.globals.bgMusic.stop()
		})

		this.buttonQuit.on('pointerover', () => {
			this.buttonQuit.setTexture('button_quit_hover')
		})

		this.buttonQuit.on('pointerout', () => {
			this.buttonQuit.setTexture('button_quit')
		})

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
