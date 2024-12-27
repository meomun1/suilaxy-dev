import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config/config.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import gameSettings from '../config/gameSettings.js'

class TitleScreen extends Phaser.Scene {
	constructor() {
		super('bootGame')
		this.music = null
		this.bgMusic = null
		this.walletConnected = false
		this.connectWalletText = null
		this.button_play = null
		this.guiManager = new GuiManager(this)
	}

	init() {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
	}

	preload() {
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')

		this.guiManager.loadImage('background', 'assets/main-menu/background.png')

		// Load BUTTONS
		this.load.image('button_play', 'assets/gui/button-play.png')
		this.load.image('button_play_hover', 'assets/gui/button-play-hover.png')
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.loadWebFonts().then(() => {
			let blackCover = this.add.rectangle(
				0,
				0,
				config.width,
				config.height,
				0x00000010,
			)
			blackCover.setOrigin(0, 0)
			blackCover.setDepth(100)

			this.tweens.add({
				targets: blackCover,
				alpha: 0,
				duration: 2500,
				onComplete: () => {
					blackCover.destroy()
				},
			})

			this.music = this.sys.game.globals.music
			if (this.music.musicOn === true && !this.music.bgMusicPlaying) {
				this.bgMusic = this.sound.add('main_menu_music', {
					volume: 0.5,
					loop: true,
				})
				this.bgMusic.play()
				this.music.bgMusicPlaying = true
				this.sys.game.globals.bgMusic = this.bgMusic
			}

			this.guiManager.createBackground('background')
			this.guiManager.createAnimatedTextMiddleNoTween('GUARDIAN', -30)
			this.guiManager.createAnimatedTextMiddleNoTween('SPACE', -130)

			this.connectWalletText = this.add.text(
				config.width / 2,
				config.height / 2 + 60,
				'Add wallet, begin Suilaxy journey!',
				{
					fontFamily: 'Pixelify Sans',
					color: '#F3F8FF',
					fontSize: '30px',
					align: 'center',
				},
			)
			this.connectWalletText.setOrigin(0.5)
			this.connectWalletText.setShadow(3, 3, '#EFBA0C', 2, false, true)
			this.tweens.add({
				targets: this.connectWalletText,
				duration: 1000,
				ease: 'Sine.easeInOut',
				repeat: -1,
				yoyo: true,
				alpha: 0.2,
			})

			this.handleWalletConnected()

			if (!gameSettings.userActive) {
				EventBus.on('wallet-connected', this.handleWalletConnected, this)
			}
		})
	}

	loadWebFonts() {
		return new Promise((resolve) => {
			WebFont.load({
				google: {
					families: ['Pixelify Sans', 'Big Shoulders Stencil Display'],
				},
				active: resolve,
			})
		})
	}

	handleWalletConnected() {
		if (gameSettings.userActive) {
			this.connectWalletText.setVisible(false)
			if (!this.button_play || gameSettings.userActive) {
				this.createPlayButton()
			}
		} else {
			this.connectWalletText.setVisible(true)
			if (this.button_play) {
				this.button_play.destroy()
				this.button_play = null
			}
		}
	}

	// createPlayButton() {
	// 	this.button_play = new Button(
	// 		this,
	// 		config.width / 2,
	// 		config.height / 2 + config.height / 8,
	// 		'button_play',
	// 		'button_play_hover',
	// 		'mainMenu',
	// 	)
	// 	this.button_play.setSize(config.width / 10, config.height / 20)
	// 	this.button_play.setInteractive()
	// 	this.button_play.setScale(1.5)
	// }

	createPlayButton() {
		const playButton = this.add.image(
			config.width / 2,
			config.height / 2 + config.height / 8,
			'button_play',
		)
		playButton.setInteractive()

		const hoverTween = {
			scale: 1.05,
			duration: 150,
			ease: 'Power2',
		}

		const normalTween = {
			scale: 1,
			duration: 150,
			ease: 'Power2',
		}

		playButton.on('pointerdown', () => {
			this.scene.start('mainMenu')
		})

		playButton.on('pointerover', () => {
			this.tweens.killTweensOf(playButton)

			this.tweens.add({
				targets: playButton,
				...hoverTween,
			})
			playButton.setTexture('button_play_hover')
		})

		playButton.on('pointerout', () => {
			this.tweens.killTweensOf(playButton)

			this.tweens.add({
				targets: playButton,
				...normalTween,
			})
			playButton.setTexture('button_play')
		})
	}

	shutdown() {
		EventBus.off('wallet-connected', this.handleWalletConnected, this)
	}
}

export default TitleScreen
