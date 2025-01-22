import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'

class MenuScreen extends Phaser.Scene {
	constructor() {
		super('mainMenu')
		this.walletConnected = false
		this.suilaxyText = null
		this.currentModeIndex = 0
		this.modes = []
		this.positions = []
		this.transitioning = false
		this.guiManager = new GuiManager(this)
	}

	preload() {
		// Load the background and buttons
		this.guiManager.loadImage('background', 'assets/main-menu/background.png')

		// Load the logo image
		this.guiManager.loadImage('logo', 'assets/main-menu/logo.png')

		// Load the NFT drop indicator
		this.guiManager.loadImage(
			'drop-indicator',
			'assets/main-menu/drop-indicator.png',
		)

		this.guiManager.loadImage('gear-button', 'assets/main-menu/gear-button.png')

		// Load the Mode Cards
		this.guiManager.loadImage('arcade-card', 'assets/main-menu/arcade-card.png')
		this.guiManager.loadImage(
			'endless-card',
			'assets/main-menu/endless-card.png',
		)
		this.guiManager.loadImage('pvp-card', 'assets/main-menu/pvp-card.png')

		// Load the next mode arrow button
		this.guiManager.loadImage(
			'next-mode-right',
			'assets/main-menu/next-mode-right.png',
		)
		this.guiManager.loadImage(
			'next-mode-left',
			'assets/main-menu/next-mode-left.png',
		)

		// init the player sprites in menu
		for (let i = 1; i <= 9; i++) {
			this.load.spritesheet({
				key: `player_texture_${i}`,
				url: `assets/spritesheets/players/planes_0${i}A.png`,
				frameConfig: {
					frameWidth: 96,
					frameHeight: 96,
					startFrame: 0,
					endFrame: 19,
				},
			})
		}
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

			// Add the background ================================================================
			this.guiManager.createBackground('background')

			// Add the NFT drop indicator ================================================================
			this.dropIndicator = this.add.image(
				0, // x coordinate, for left side of the screen
				config.height / 3.5, // y coordinate, for vertical center
				'drop-indicator',
			)
			this.dropIndicator.setOrigin(0, 0.5)
			this.dropIndicator.setInteractive()
			this.dropIndicator.on('pointerover', () => {
				this.tweens.add({
					targets: this.dropIndicator,
					scaleX: 1.03,
					scaleY: 1.03,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.dropIndicator.on('pointerout', () => {
				this.tweens.add({
					targets: this.dropIndicator,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})

			// Add the Gear Up button ================================================================
			this.gearButton = this.add.image(
				config.width, // x coordinate, for right side of the screen
				config.height / 3.5, // y coordinate, for bottom of the screen
				'gear-button',
			)
			this.gearButton.setOrigin(1, 0.5)
			this.gearButton.setInteractive()
			this.gearButton.on('pointerover', () => {
				this.tweens.add({
					targets: this.gearButton,
					scaleX: 1.03,
					scaleY: 1.03,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.gearButton.on('pointerout', () => {
				this.tweens.add({
					targets: this.gearButton,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.gearButton.on('pointerdown', () => {
				this.scene.start('selectUtility')
			})

			// Add the Suilaxy text ================================================================
			this.suilaxyText = this.add.text(
				config.width * 0 + config.width * 0.24,
				config.height * 0 + config.height * 0.1,
				'THE JOURNEY BEGINS',
				{
					fontFamily: 'Big Shoulders Stencil Display',
					color: '#FFFFFF',
					fontSize: '48px',
					fontStyle: 'bold',
					align: 'center',
				},
			)
			this.suilaxyText.setOrigin(0.5).setAngle(0)
			this.suilaxyText.setShadow(0, 0, '#FFD700', 6, true, true)
			this.suilaxyText.setPadding(10, 10, 10, 10)

			this.logo = this.add.image(
				config.width * 0 + config.width * 0.01,
				config.width * 0 + config.width * 0.01,
				'logo',
			)
			this.logo.setOrigin(0, 0)
			this.logo.setDepth(1)

			// Define Positions ================================================================
			this.positions = [
				{ x: 0, y: config.height + config.height / 4 }, // Left position
				{ x: config.width / 2, y: config.height }, // Middle position
				{ x: config.width, y: config.height + config.height / 4 }, // Right position
			]

			// Initialize Mode Cards at respective positions =====================================
			this.arcadeCard = this.add
				.image(this.positions[1].x, this.positions[1].y, 'arcade-card')
				.setOrigin(0.5, 1)
				.setInteractive()
			this.arcadeCard.on('pointerover', () => {
				this.tweens.add({
					targets: this.arcadeCard,
					scaleX: 1.03,
					scaleY: 1.03,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.arcadeCard.on('pointerout', () => {
				this.tweens.add({
					targets: this.arcadeCard,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.arcadeCard.on('pointerdown', () => {
				this.startArcadeMode()
			})

			this.endlessCard = this.add
				.image(this.positions[0].x, this.positions[0].y, 'endless-card')
				.setOrigin(0.5, 1)
				.setInteractive()
				.setAlpha(0.5)
			this.endlessCard.on('pointerover', () => {
				this.tweens.add({
					targets: this.endlessCard,
					scaleX: 1.03,
					scaleY: 1.03,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.endlessCard.on('pointerout', () => {
				this.tweens.add({
					targets: this.endlessCard,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})

			this.pvpCard = this.add
				.image(this.positions[2].x, this.positions[2].y, 'pvp-card')
				.setOrigin(0.5, 1)
				.setInteractive()
				.setAlpha(0.5)
			this.pvpCard.on('pointerover', () => {
				this.tweens.add({
					targets: this.pvpCard,
					scaleX: 1.03,
					scaleY: 1.03,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.pvpCard.on('pointerout', () => {
				this.tweens.add({
					targets: this.pvpCard,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.pvpCard.on('pointerdown', () => {
				this.startPVPMode()
			})

			// Store them in an array for easy access
			this.modes = [this.arcadeCard, this.endlessCard, this.pvpCard]

			// Add the Next Mode Arrow Buttons ================================================================
			this.nextModeRight = this.add
				.image(
					config.width - config.width / 3.6,
					config.height - config.height / 2.5,
					'next-mode-right',
				)
				.setOrigin(0.5, 0.5)
				.setInteractive()
			this.nextModeRight.on('pointerover', () => {
				this.tweens.add({
					targets: this.nextModeRight,
					scaleX: 1.1,
					scaleY: 1.1,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.nextModeRight.on('pointerout', () => {
				this.tweens.add({
					targets: this.nextModeRight,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})

			this.nextModeLeft = this.add
				.image(
					config.width / 3.6,
					config.height - config.height / 2.5,
					'next-mode-left',
				)
				.setOrigin(0.5, 0.5)
				.setInteractive()
			this.nextModeLeft.on('pointerover', () => {
				this.tweens.add({
					targets: this.nextModeLeft,
					scaleX: 1.1,
					scaleY: 1.1,
					duration: 200,
					ease: 'Power2',
				})
			})
			this.nextModeLeft.on('pointerout', () => {
				this.tweens.add({
					targets: this.nextModeLeft,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2',
				})
			})

			this.nextModeRight.on('pointerdown', () => this.switchMode(-1))
			this.nextModeLeft.on('pointerdown', () => this.switchMode(1))
		})
	}

	switchMode(direction) {
		if (this.transitioning) return // Prevent multiple transitions at the same time

		this.transitioning = true

		// Rotate the modes array to reflect the new order
		if (direction > 0) {
			this.modes.unshift(this.modes.pop()) // Move last to the front
		} else {
			this.modes.push(this.modes.shift()) // Move first to the back
		}

		// Define the positions (left, center, right)
		const positions = [
			{ x: 0, y: config.height + config.height / 4 }, // Left position
			{ x: config.width / 2, y: config.height }, // Middle position
			{ x: config.width, y: config.height + config.height / 4 }, // Right position
		]

		// Swap positions and alpha values directly
		this.modes.forEach((mode, index) => {
			this.tweens.add({
				targets: mode,
				x: positions[index].x,
				y: positions[index].y,
				alpha: index === 1 ? 1 : 0.5, // Full opacity for center position
				duration: 500,
				ease: 'Power2',
				onComplete: () => {
					if (index === this.modes.length - 1) {
						this.transitioning = false // Allow further transitions after the last one completes
					}
				},
			})
		})
	}

	startArcadeMode() {
		// Start the Arcade mode scene
		// this.scene.start('loadingScreen')
		this.scene.start('powerScreen')
	}

	startPVPMode() {
		// Start the PvP mode scene
		this.scene.start('chooseRoom')
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

	shutdown() {
		EventBus.off('wallet-connected', this.handleWalletConnected, this)
	}
}

export default MenuScreen
