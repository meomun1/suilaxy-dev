import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'
import { EventBus } from '../EventBus.js'

class TitleScreen extends Phaser.Scene {
	constructor() {
		super('bootGame')
		this.music = null
		this.bgMusic = null
		this.walletConnected = false
		this.connectWalletText = null
		this.button_play = null
	}

	init() {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
	}

	preload() {
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')
		this.load.image(
			'background',
			'assets/images/backgrounds/background_title.png',
		)
		this.load.spritesheet({
			key: 'button_play',
			url: 'assets/gui/button_play.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 2,
				endFrame: 2,
			},
		})
		this.load.spritesheet({
			key: 'button_play_hover',
			url: 'assets/gui/button_play_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 2,
				endFrame: 2,
			},
		})
	}

	create() {
		let blackCover = this.add.rectangle(
			0,
			0,
			config.width,
			config.height,
			0x000000,
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
		if (this.music.musicOn === true) {
			this.bgMusic = this.sound.add('main_menu_music', {
				volume: 0.5,
				loop: true,
			})
			this.bgMusic.play()
			this.music.bgMusicPlaying = true
			this.sys.game.globals.bgMusic = this.bgMusic
		}

		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background',
		)
		this.background.setOrigin(0, 0)

		const spaceText = this.add.text(
			config.width / 2,
			config.height / 2 - 130,
			'SPACE',
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '100px',
				color: '#F3F8FF',
				align: 'center',
			},
		)
		spaceText.setOrigin(0.5)
		spaceText.setShadow(3, 3, '#F27CA4', 2, false, true)

		const guardianText = this.add.text(
			config.width / 2,
			config.height / 2 - 30,
			'GUARDIAN',
			{
				fontFamily: 'Pixelify Sans',
				color: '#F3F8FF',
				fontSize: '100px',
				align: 'center',
			},
		)
		guardianText.setOrigin(0.5)
		guardianText.setShadow(3, 3, '#F27CA4', 2, false, true)

		this.tweens.add({
			targets: guardianText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})
		this.tweens.add({
			targets: spaceText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})

		this.connectWalletText = this.add.text(
			config.width / 2,
			config.height / 2 + 60,
			'Connect wallet, begin the Suilaxy journey!',
			{
				fontFamily: 'Pixelify Sans',
				color: '#F3F8FF',
				fontSize: '20px',
				align: 'center',
			},
		)
		this.connectWalletText.setOrigin(0.5)
		this.connectWalletText.setShadow(3, 3, '#F27CA4', 2, false, true)

		EventBus.on('wallet-connected', this.handleWalletConnected, this)
	}

	handleWalletConnected(data) {
		if (data.connected) {
			this.connectWalletText.setVisible(false)
			if (!this.button_play) {
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

	createPlayButton() {
		this.button_play = new Button(
			this,
			config.width / 2,
			config.height / 2 + 60,
			'button_play',
			'button_play_hover',
			'choosePlayer',
		)
		this.button_play.setSize(93, 28)
		this.button_play.setInteractive()

		this.button_play.on('pointerdown', () => {
			this.cameras.main.fadeOut(1500, false, () => {
				this.scene.start('choosePlayer')
			})
		})

		this.button_play.on('pointerover', () => {
			this.button_play.setTexture('button_play_hover')
		})

		this.button_play.on('pointerout', () => {
			this.button_play.setTexture('button_play')
		})

		this.input.keyboard.on('keydown-ENTER', () => {
			this.scene.start('choosePlayer')
		})

		this.button_play.setScale(1.5)
	}

	shutdown() {
		EventBus.off('wallet-connected', this.handleWalletConnected, this)
	}
}

export default TitleScreen
