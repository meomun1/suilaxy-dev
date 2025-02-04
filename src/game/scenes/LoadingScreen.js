import Phaser from 'phaser'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import { loadImageLoading } from '../utils/loadImage.js'
import {
	loadSpriteSheetsLoading,
	bulletSprites,
	effectSprites,
	loadPlayerSpriteSheetNormal,
	loadBulletSpriteSheet,
	loadEffectSpriteSheet,
} from '../utils/loadSpriteSheets.js'
import { loadAudio } from '../utils/loadAudio.js'
import { createAnimationForLoading } from '../utils/loadAnimations.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'

class LoadingScreen extends Phaser.Scene {
	constructor() {
		super('loadingScreen')
		this.guiManager = new GuiManager(this)
	}

	init() {
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		loadImageLoading(this)
		loadSpriteSheetsLoading(this)
		loadPlayerSpriteSheetNormal(this)
		loadAudio(this)

		// Load the appropriate spritesheet based on selectedPlayerIndex
		const bulletSprite = bulletSprites[gameSettings.selectedPlayerIndex]
		loadBulletSpriteSheet(this, bulletSprite)

		// Load Effect Spritesheets
		const effectSprite = effectSprites[gameSettings.selectedPlayerIndex]
		loadEffectSpriteSheet(this, effectSprite)
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		this.cameras.main.fadeIn(500, 0, 0, 0)

		const loadingText = this.add.text(
			config.width / 2,
			config.height / 2 - 60,
			'LOADING : First time may take a while',
			{ fontFamily: 'Pixelify Sans', fontSize: '50px', fill: '#fff' },
		)
		loadingText.setOrigin(0.5)

		createAnimationForLoading(this)

		this.time.delayedCall(1000, () => {
			let value = this.selectedPlayerIndex
			loadingText.destroy()
			if (gameSettings.userWalletAdress != '') {
				this.scene.start('playTutorial', { number: value })
			}
		})
	}
}

export default LoadingScreen
