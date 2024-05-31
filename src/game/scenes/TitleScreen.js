import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'

class TitleScreen extends Phaser.Scene {
	constructor() {
		super('bootGame')
		this.music = null
		this.bgMusic = null
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

		this.load.spritesheet({
			key: 'button_rank',
			url: 'assets/gui/button_play.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 4,
				endFrame: 4,
			},
		})

		this.load.spritesheet({
			key: 'button_rank_hover',
			url: 'assets/gui/button_play_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 4,
				endFrame: 4,
			},
		})

		this.load.spritesheet({
			key: 'button_credit',
			url: 'assets/gui/button_play.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 1,
				endFrame: 1,
			},
		})

		this.load.spritesheet({
			key: 'button_credit_hover',
			url: 'assets/gui/button_play_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 1,
				endFrame: 1,
			},
		})

		this.load.spritesheet({
			key: 'button_exit',
			url: 'assets/gui/button_play.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 6,
				endFrame: 6,
			},
		})

		this.load.spritesheet({
			key: 'button_exit_hover',
			url: 'assets/gui/button_play_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 6,
				endFrame: 6,
			},
		})
	}

	create() {
		// Create a black rectangle that covers the whole game
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
			onComplete: function () {
				blackCover.destroy()
			},
		})

		// Create Music
		this.music = this.sys.game.globals.music
		// && this.music.bgMusicPlaying === false
		if (this.music.musicOn === true) {
			this.bgMusic = this.sound.add('main_menu_music', {
				volume: 0.5,
				loop: true,
			})
			this.bgMusic.play()
			this.music.bgMusicPlaying = true
			this.sys.game.globals.bgMusic = this.bgMusic
		}
		// Create Background
		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background',
		)
		this.background.setOrigin(0, 0)

		// Create "SPACE" text
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

		// Tween animation for the rainbow effect on "GUARDIAN"
		this.tweens.add({
			targets: guardianText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})

		// Tween animation for the rainbow effect on "SPACE"
		this.tweens.add({
			targets: spaceText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})

		// Create Play Button
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

		// Event listeners for the play button
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

		// Event listener for Enter key
		this.input.keyboard.on('keydown-ENTER', () => {
			this.scene.start('choosePlayer')
		})

		// Create rank Button
		this.button_rank = new Button(
			this,
			config.width / 2,
			config.height / 2 + 110,
			'button_rank',
			'button_rank_hover',
			'leaderboard',
		)
		this.button_rank.setSize(93, 28)
		this.button_rank.setInteractive()

		// Create Credit Button
		this.button_credit = new Button(
			this,
			config.width / 2,
			config.height / 2 + 160,
			'button_credit',
			'button_credit_hover',
			'CreditsScene',
		)

		this.button_rank.on('pointerover', () => {
			this.button_rank.setTexture('button_rank_hover')
		})

		this.button_rank.on('pointerout', () => {
			this.button_rank.setTexture('button_rank')
		})

		this.button_credit.on('pointerdown', () => {
			this.button_credit.setTexture('button_credit_hover')
		})

		this.button_play.setScale(1.5)
		this.button_rank.setScale(1.5)
		this.button_credit.setScale(1.5)
	}
}
export default TitleScreen
