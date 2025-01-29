import Phaser from 'phaser'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import { loadImages } from '../utils/loadImage.js'
import {
	loadSpriteSheets,
	loadSpriteSheetIfNotExists,
	bulletSprites,
	effectSprites,
	additionalEffectSprites,
	loadPlayerSpriteSheetNormal,
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
		loadImages(this)
		loadSpriteSheets(this)
		loadPlayerSpriteSheetNormal(this)
		loadAudio(this)

		// Load the appropriate spritesheet based on selectedPlayerIndex
		const bulletSprite = bulletSprites[gameSettings.selectedPlayerIndex]
		if (bulletSprite) {
			loadSpriteSheetIfNotExists(
				this,
				bulletSprite.key,
				bulletSprite.path,
				bulletSprite.frameWidth,
				bulletSprite.frameHeight,
				bulletSprite.margin,
				bulletSprite.spacing,
			)
		}

		// Load enemy Bullet Spritesheet
		loadSpriteSheetIfNotExists(
			this,
			'bullet_texture',
			'assets/spritesheets/vfx/bullet.png',
			12,
			26,
			0,
			2,
		)

		// Load Effect Spritesheets
		const effectSprite = effectSprites[gameSettings.selectedPlayerIndex]
		if (effectSprite) {
			loadSpriteSheetIfNotExists(
				this,
				effectSprite.key,
				effectSprite.path,
				effectSprite.frameWidth,
				effectSprite.frameHeight,
				effectSprite.margin,
				effectSprite.spacing,
			)
		}

		// Load additional effect sprites
		additionalEffectSprites.forEach((sprite) => {
			loadSpriteSheetIfNotExists(
				this,
				sprite.key,
				sprite.path,
				sprite.frameWidth,
				sprite.frameHeight,
				sprite.margin,
				sprite.spacing,
			)
		})
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
