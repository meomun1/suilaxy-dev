import Phaser from 'phaser'
import config from '../config/config'
import Bug3 from '../objects/enemies/Bug3'
import Bug5 from '../objects/enemies/Bug5'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { loadAudioPlayingScreen } from '../utils/loadAudio.js'
import { loadPlayerSpriteSheetNormal } from '../utils/loadSpriteSheets.js'
import { createScene } from '../utils/initForGameScene.js'
import {
	addCollisionWithUtils,
	addCollisionNormal,
} from '../utils/addCollision.js'
import { handleEnterKey, gameOver, shutdown } from '../utils/endGamescene.js'
import { createText } from '../utils/createText.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class TestScene extends Phaser.Scene {
	constructor() {
		super('testGame')
		this.callingScene = 'testGame'
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		loadAudioPlayingScreen(this)
		loadPlayerSpriteSheetNormal(this)
	}

	// addEnemyLevelOne() {
	// 	this.EnemyManager.spawnEnemyRowWithDelay(this, 3000, config.width / 3, 3)
	// 	this.EnemyManager.spawnEnemyRowWithDelay(this, 5000, config.width / 4, 6)
	// 	this.EnemyManager.spawnEnemyRowWithDelay(this, 7000, config.width / 5, 9)
	// 	this.EnemyManager.spawnEnemyRowWithDelay(this, 9000, config.width / 6, 12)

	// 	this.EnemyManager.spawnZigZagEnemyWithDelay(
	// 		this,
	// 		12000,
	// 		config.width / 10,
	// 		4,
	// 		600,
	// 	)

	// 	this.time // Spawn the Enemies
	// 		.delayedCall(
	// 			21000,
	// 			() => {
	// 				// shoot straight bullet
	// 				this.bug3_1 = new Bug3(
	// 					this,
	// 					config.width - config.width / 16,
	// 					-20,
	// 					500,
	// 					1,
	// 				)
	// 				this.bug3_2 = new Bug3(this, config.width / 16, -20, 500, 1)
	// 				this.bug3_3 = new Bug3(this, config.width / 2, -20, 1000, 2)

	// 				// chasing enemies
	// 				this.bug5_1 = new Bug5( // left top
	// 					this,
	// 					-config.width / 32,
	// 					-config.height / 8,
	// 					200,
	// 				)
	// 				this.bug5_2 = new Bug5( // right top
	// 					this,
	// 					config.width + config.width / 32,
	// 					-config.height / 8,
	// 					200,
	// 				)
	// 				this.bug5_3 = new Bug5( // left bottom
	// 					this,
	// 					-config.width / 32,
	// 					config.height + config.height / 32,
	// 					200,
	// 				)
	// 				this.bug5_4 = new Bug5( // right bottom
	// 					this,
	// 					config.width + config.width / 32,
	// 					config.height + config.height / 32,
	// 					200,
	// 				)

	// 				this.EnemyManager.addEnemyForOnce(this.bug3_1)
	// 				this.EnemyManager.addEnemyForOnce(this.bug3_2)
	// 				this.EnemyManager.addEnemyForOnce(this.bug3_3)
	// 				this.EnemyManager.addEnemyForOnce(this.bug5_1)
	// 				this.EnemyManager.addEnemyForOnce(this.bug5_2)
	// 				this.EnemyManager.addEnemyForOnce(this.bug5_3)
	// 				this.EnemyManager.addEnemyForOnce(this.bug5_4)
	// 			},
	// 			null,
	// 			this,
	// 		)

	// 	// FINAL WAVE
	// 	this.time.delayedCall(
	// 		30000,
	// 		() => {
	// 			this.startFinalWave()
	// 		},
	// 		null,
	// 		this,
	// 	)

	// 	this.time.delayedCall(
	// 		42000,
	// 		() => {
	// 			this.EnemyManager.gameStarted = true
	// 		},
	// 		null,
	// 		this,
	// 	)
	// }
	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		this.guiManager = new GuiManager(this)

		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.cameras.main.fadeIn(500, 0, 0, 0)

		this.music = this.sys.game.globals.music

		this.guiManager.createBackground('background_texture_01')

		this.createLevel1Text()

		createScene(this)

		this.addEnemyLevelOne()

		addCollisionWithUtils(this, 20000, 2, 2)

		addCollisionWithUtils(this, 30000, 2, 2)

		addCollisionWithUtils(this, 40000, 2, 2)

		addCollisionNormal(this)

		this.selectedPlayerIndex = Number(gameSettings.selectedPlayerIndex)
	}

	update() {
		// Pause the game
		this.keyboardManager.pauseGame()

		// Move the background
		this.background.tilePositionY -= BACKGROUND_SCROLL_SPEED

		//PLAYER
		this.PlayerManager.movePlayer()
		this.PlayerManager.healthPlayer()

		if (
			this.spacebar.isDown &&
			this.selectedPlayerIndex !== 1 &&
			this.selectedPlayerIndex !== 6 &&
			this.selectedPlayerIndex !== 8
		) {
			this.player.shootBullet(this.selectedPlayerIndex) // Use the converted number
		} else if (this.spacebar.isDown && this.selectedPlayerIndex === 6) {
			this.player.createShield(this.player)
		} else if (this.spacebar.isDown && this.selectedPlayerIndex === 8) {
			this.player.createWing(this.player)
		} else if (this.spacebar.isDown && this.selectedPlayerIndex === 1) {
			this.player.createRandomBullet(this.player)
		}

		this.projectiles.children.iterate((bullet) => {
			if (bullet) {
				bullet.update(this.player)
			}
		})

		this.projectilesEnemyEffects.children.iterate((effect) => {
			if (effect) {
				effect.update()
			}
		})

		if (this.player.health <= 0) {
			gameOver(this)
		}

		this.shield.updatePosition(this.player)

		// ENEMY
		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()
	}

	goToNextLevel() {
		// Check for Enter key press continuously in the update loop
		this.time.delayedCall(1000, handleEnterKey(this), [], this)
	}
}

export default TestScene
