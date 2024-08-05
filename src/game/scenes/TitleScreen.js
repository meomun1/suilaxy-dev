import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config/config.js'
import Button from '../objects/Button.js'
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
		this.button_pvp = null
		this.guiManager = new GuiManager(this)
	}

	init() {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
	}

	preload() {
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')

		this.guiManager.loadImage(
			'background',
			// 'assets/images/backgrounds/background_title.png',
			'background.png',
		)
		this.guiManager.loadSpriteSheet(
			'button_play',
			'assets/gui/button.png',
			93,
			28,
			2,
			2,
		)
		this.guiManager.loadSpriteSheet(
			'button_play_hover',
			'assets/gui/button_hover.png',
			93,
			28,
			2,
			2,
		)

		this.guiManager.loadSpriteSheet(
			'button_pvp',
			'assets/gui/button.png',
			93,
			28,
			9,
			9,
		)
		this.guiManager.loadSpriteSheet(
			'button_pvp_hover',
			'assets/gui/button_hover.png',
			93,
			28,
			9,
			9,
		)
	}

	create() {
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
			this.guiManager.createAnimatedTextMiddle('GUARDIAN', -30)
			this.guiManager.createAnimatedTextMiddle('SPACE', -130)

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
			this.connectWalletText.setShadow(3, 3, '#F27CA4', 2, false, true)

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
		console.log('hehe', gameSettings.userActive)
		if (gameSettings.userActive) {
			console.log('one')
			this.connectWalletText.setVisible(false)
			if (!this.button_play || gameSettings.userActive) {
				this.createPlayButton()
				this.createPVPButton()
			}
		} else {
			console.log('two')
			this.connectWalletText.setVisible(true)
			if (this.button_play && this.button_pvp) {
				this.button_play.destroy()
				this.button_play = null
				this.button_pvp.destroy()
				this.button_pvp = null
			}
		}
	}

	createPlayButton() {
		this.button_play = new Button(
			this,
			config.width / 2,
			config.height / 2 + config.height / 8,
			'button_play',
			'button_play_hover',
			'choosePlayer',
		)
		this.button_play.setSize(config.width / 10, config.height / 20)
		this.button_play.setInteractive()
		this.button_play.setScale(1.5)
	}

	createPVPButton() {
		this.button_pvp = new Button(
			this,
			config.width / 2,
			config.height / 2 + config.height / 4,
			'button_pvp',
			'button_pvp_hover',
			'chooseRoom',
		)
		this.button_pvp.setSize(config.width / 10, config.height / 20)
		this.button_pvp.setInteractive()
		this.button_pvp.setScale(1.5)
	}

	shutdown() {
		EventBus.off('wallet-connected', this.handleWalletConnected, this)
	}
}

export default TitleScreen
