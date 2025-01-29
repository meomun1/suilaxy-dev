import Phaser from 'phaser'
import config from '../config/config'
import CollideManager from '../manager/CollideManager.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { createScene } from '../utils/initForGameScene.js'
import { loadPlayerSpriteSheetNormal } from '../utils/loadSpriteSheets.js'
import { handleEnterKey, gameOver } from '../utils/endGamescene.js'
import { createText, createDelayText } from '../utils/createText.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class LevelThreeScreen extends Phaser.Scene {
	constructor() {
		super('playLevelThree')
		this.callingScene = 'playLevelThree'
		this.guiManager = new GuiManager(this)
	}

	init(data) {
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		loadPlayerSpriteSheetNormal(this)
	}

	createLevelThreeText() {
		// Create text for level 3
		createText(
			'LEVEL 3: FLEXIBILITY',
			config.width / 2,
			config.height / 2 - 60,
			2000,
			this,
		)

		createDelayText(
			'Try your best to survive!',
			config.width / 2,
			config.height / 2 - 60,
			16000,
			2000,
			this,
		)
	}

	addEnemyLevelThree() {
		this.time.delayedCall(
			20000,
			() => {
				this.EnemyManager.spawnBugRain(20, 4000, 200)
			},
			null,
			this,
		)

		this.time.delayedCall(
			26000,
			() => {
				this.EnemyManager.spawnBugRainLeftToRight(20, 4000, 200)
			},
			null,
			this,
		)

		this.time.delayedCall(
			32000,
			() => {
				this.EnemyManager.spawnBugRainRightToLeft(20, 4000, 200)
			},
			null,
			this,
		)

		this.time.delayedCall(
			35000,
			() => {
				this.EnemyManager.spawnBugRainBottomToTop(20, 4000, 200)
			},
			null,
			this,
		)
		this.time.delayedCall(
			40000,
			() => {
				this.EnemyManager.gameStarted = true
			},
			null,
			this,
		)
	}

	roundToTwoDecimals(value) {
		return Math.round(value) + 0.5
	}

	createLaserPolygon() {
		const width = config.width // Define width parameter
		const height = config.height // Define height parameter

		const border = new Phaser.Geom.Polygon([
			0 + 0.5,
			0 + 0.5,
			config.width - 0.5,
			0 + 0.5,
			config.width - 0.5,
			config.height - 0.5,
			0 + 0.5,
			config.height - 0.5,
			0 + 0.5,
			0 + 0.5,
		])

		const shape1 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.125) - config.width / 16,
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.15) - config.width / 16,
			this.roundToTwoDecimals(height * 0.083),
			this.roundToTwoDecimals(width * 0.25) - config.width / 16,
			this.roundToTwoDecimals(height * 0.133),
			this.roundToTwoDecimals(width * 0.175) - config.width / 16,
			this.roundToTwoDecimals(height * 0.35),
			this.roundToTwoDecimals(width * 0.125) - config.width / 16,
			this.roundToTwoDecimals(height * 0.25),
		])

		const shape7 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.125),
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.15),
			this.roundToTwoDecimals(height * 0.083),
			this.roundToTwoDecimals(width * 0.25),
			this.roundToTwoDecimals(height * 0.133),
			this.roundToTwoDecimals(width * 0.175),
			this.roundToTwoDecimals(height * 0.35),
			this.roundToTwoDecimals(width * 0.125),
			this.roundToTwoDecimals(height * 0.25),
		])

		const shape2 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.125) - config.width / 16,
			this.roundToTwoDecimals(height * 0.333),
			this.roundToTwoDecimals(width * 0.15) - config.width / 16,
			this.roundToTwoDecimals(height * 0.417),
			this.roundToTwoDecimals(width * 0.075) - config.width / 16,
			this.roundToTwoDecimals(height * 0.5),
			this.roundToTwoDecimals(width * 0.125) - config.width / 16,
			this.roundToTwoDecimals(height * 0.333),
		])

		const shape8 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.125),
			this.roundToTwoDecimals(height * 0.333),
			this.roundToTwoDecimals(width * 0.15),
			this.roundToTwoDecimals(height * 0.417),
			this.roundToTwoDecimals(width * 0.075),
			this.roundToTwoDecimals(height * 0.5),
			this.roundToTwoDecimals(width * 0.125),
			this.roundToTwoDecimals(height * 0.333),
		])

		const shape3 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.25),
			this.roundToTwoDecimals(height * 0.433),
			this.roundToTwoDecimals(width * 0.275),
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.375),
			this.roundToTwoDecimals(height * 0.333),
			this.roundToTwoDecimals(width * 0.4375),
			this.roundToTwoDecimals(height * 0.533),
			this.roundToTwoDecimals(width * 0.25),
			this.roundToTwoDecimals(height * 0.433),
		])

		const shape9 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.25),
			this.roundToTwoDecimals(height * 0.433),
			this.roundToTwoDecimals(width * 0.275),
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.375),
			this.roundToTwoDecimals(height * 0.333),
			this.roundToTwoDecimals(width * 0.4375),
			this.roundToTwoDecimals(height * 0.533),
			this.roundToTwoDecimals(width * 0.25),
			this.roundToTwoDecimals(height * 0.433),
		])

		const shape4 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.425),
			this.roundToTwoDecimals(height * 0.1),
			this.roundToTwoDecimals(width * 0.45),
			this.roundToTwoDecimals(height * 0.067),
			this.roundToTwoDecimals(width * 0.4625),
			this.roundToTwoDecimals(height * 0.117),
			this.roundToTwoDecimals(width * 0.425),
			this.roundToTwoDecimals(height * 0.1),
		])

		const shape10 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.425),
			this.roundToTwoDecimals(height * 0.1),
			this.roundToTwoDecimals(width * 0.45),
			this.roundToTwoDecimals(height * 0.067),
			this.roundToTwoDecimals(width * 0.4625),
			this.roundToTwoDecimals(height * 0.117),
			this.roundToTwoDecimals(width * 0.425),
			this.roundToTwoDecimals(height * 0.1),
		])

		const shape5 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.5625),
			this.roundToTwoDecimals(height * 0.317),
			this.roundToTwoDecimals(width * 0.7),
			this.roundToTwoDecimals(height * 0.283),
			this.roundToTwoDecimals(width * 0.675),
			this.roundToTwoDecimals(height * 0.45),
			this.roundToTwoDecimals(width * 0.5375),
			this.roundToTwoDecimals(height * 0.483),
			this.roundToTwoDecimals(width * 0.5625),
			this.roundToTwoDecimals(height * 0.317),
		])

		const shape11 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.5625),
			this.roundToTwoDecimals(height * 0.317),
			this.roundToTwoDecimals(width * 0.7),
			this.roundToTwoDecimals(height * 0.283),
			this.roundToTwoDecimals(width * 0.675),
			this.roundToTwoDecimals(height * 0.45),
			this.roundToTwoDecimals(width * 0.5375),
			this.roundToTwoDecimals(height * 0.483),
			this.roundToTwoDecimals(width * 0.5625),
			this.roundToTwoDecimals(height * 0.317),
		])

		const shape6 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.5),
			this.roundToTwoDecimals(height * 0.158),
			this.roundToTwoDecimals(width * 0.725),
			this.roundToTwoDecimals(height * 0.083),
			this.roundToTwoDecimals(width * 0.6),
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.5),
			this.roundToTwoDecimals(height * 0.158),
		])

		const shape12 = new Phaser.Geom.Polygon([
			this.roundToTwoDecimals(width * 0.5),
			this.roundToTwoDecimals(height * 0.158),
			this.roundToTwoDecimals(width * 0.725),
			this.roundToTwoDecimals(height * 0.083),
			this.roundToTwoDecimals(width * 0.6),
			this.roundToTwoDecimals(height * 0.25),
			this.roundToTwoDecimals(width * 0.5),
			this.roundToTwoDecimals(height * 0.158),
		])

		Phaser.Geom.Polygon.Translate(shape2, 0, Math.round(height / 4))
		Phaser.Geom.Polygon.Translate(shape5, Math.round(width / 16), 0)
		Phaser.Geom.Polygon.Translate(
			shape7,
			Math.round((width * 11) / 16),
			Math.round(height / 3),
		)
		Phaser.Geom.Polygon.Translate(
			shape8,
			Math.round(width / 2 + width / 4 + width / 16),
			Math.round(height / 2.5 + height / 16),
		)
		Phaser.Geom.Polygon.Translate(
			shape9,
			Math.round((width * 6) / 20),
			Math.round((height * 25) / 60),
		)
		Phaser.Geom.Polygon.Translate(
			shape10,
			Math.round(-(width * 7) / 25),
			Math.round((height * 2.5) / 5),
		)
		Phaser.Geom.Polygon.Translate(
			shape11,
			Math.round((-width * 3) / 8),
			Math.round((height * 9) / 20),
		)
		Phaser.Geom.Polygon.Translate(
			shape12,
			Math.round(width / 4),
			Math.round(-height / 20),
		)

		const shapes = [
			border,
			shape1,
			shape2,
			shape3,
			shape4,
			shape5,
			// shape6,
			shape7,
			shape8,
			shape9,
			shape10,
			shape11,
			shape12,
		]

		const ray = new Phaser.Geom.Line(
			Math.random() * width,
			Math.random() * height,
			Math.random() * width,
			Math.random() * height,
		)

		const debug = this.add.graphics()
		debug.setDepth(1)

		let velocityX = Math.random() * 300 - 100
		let velocityY = Math.random() * 200 - 100

		const speed = 1.5
		const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
		velocityX = (velocityX / magnitude) * speed
		velocityY = (velocityY / magnitude) * speed

		this.collisionCooldown = false

		// Draw the rays
		const draw = () => {
			let pointerX = ray.x1 + velocityX
			let pointerY = ray.y1 + velocityY

			if (pointerX < 0 || pointerX > width) {
				velocityX = -velocityX
			}
			if (pointerY < 0 || pointerY > height) {
				velocityY = -velocityY
			}

			// Get the intersection points
			const intersects = Phaser.Geom.Intersects.GetRaysFromPointToPolygon(
				this.roundToTwoDecimals(pointerX),
				this.roundToTwoDecimals(pointerY),
				shapes,
			)

			// Draw the rays
			ray.setTo(ray.x1, ray.y1, pointerX, pointerY)

			debug.clear()

			debug.lineStyle(1, 0x01ff00)
			// Draw the shapes
			shapes.forEach((shape) => {
				debug.strokePoints(shape.points, true)
			})
			// Set the fill style
			debug.lineStyle(1, 0xff0000)
			debug.fillStyle(0xff0000)

			const playerBounds = this.player.getBounds()

			// Draw the intersection points and the lines
			intersects.forEach((line) => {
				const roundedX = this.roundToTwoDecimals(line.x)
				const roundedY = this.roundToTwoDecimals(line.y)
				ray.setTo(
					this.roundToTwoDecimals(pointerX),
					this.roundToTwoDecimals(pointerY),
					roundedX,
					roundedY,
				)
				debug.strokeLineShape(ray)
				debug.fillCircle(roundedX, roundedY, 4)

				if (
					this.lineIntersectsRect(
						pointerX,
						pointerY,
						roundedX,
						roundedY,
						playerBounds,
					) &&
					!this.collisionCooldown
				) {
					this.player.takeDamage(100)
					this.collisionCooldown = true

					// Reset cooldown after a delay (e.g., 1 second)
					this.time.delayedCall(1000, () => {
						this.collisionCooldown = false
					})
				}
			})

			ray.x1 = pointerX
			ray.y1 = pointerY
		}

		this.time.addEvent({
			delay: 16,
			callback: draw,
			callbackScope: this,
			loop: true,
		})
	}

	lineIntersectsRect(x1, y1, x2, y2, rect) {
		// Check if the line intersects any of the four edges of the rectangle
		return (
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.x,
				rect.y,
				rect.x + rect.width / 16,
				rect.y,
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.x,
				rect.y,
				rect.x,
				rect.y + rect.height / 16,
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.x + rect.width / 16,
				rect.y,
				rect.x + rect.width / 16,
				rect.y + rect.height / 16,
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.x,
				rect.y + rect.height / 16,
				rect.x + rect.width / 16,
				rect.y + rect.height / 16,
			)
		)
	}

	lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
		const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
		if (denom === 0) return false
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
		return t >= 0 && t <= 1 && u >= 0 && u <= 1
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.cameras.main.fadeIn(1000, 0, 0, 0)
		// Creat GUI for PlayingScreen ( Changes in BG except Player and Enemy )
		this.guiManager.createBackground('background_texture_02')

		this.music = this.sys.game.globals.music

		this.createLevelThreeText()

		createScene(this)

		this.createLaserPolygon()

		this.addEnemyLevelThree()

		this.time.addEvent({
			delay: 5000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(6, 6)
				this.CollideManager1 = new CollideManager(
					this,
					this.player,
					this.EnemyManager.enemies,
					this.UtilitiesManager.HealthPacks,
					this.UtilitiesManager.shieldPacks,
					this.shield,
					this.SoundManager,
				)
			},
			callbackScope: this,
		})

		this.CollideManager = new CollideManager(
			this,
			this.player,
			this.EnemyManager.enemies,
			this.UtilitiesManager.HealthPacks,
			this.UtilitiesManager.shieldPacks,
			this.shield,
			this.SoundManager,
		)

		this.selectedPlayerIndex = Number(gameSettings.selectedPlayerIndex)

		console.log('Level Three')
		console.log('Save Player Speed: ', gameSettings.savePlayerSpeed)
		console.log(
			'Save Player Bullet Damage: ',
			gameSettings.savePlayerBulletDamage,
		)
		console.log('Save Player Lifesteal: ', gameSettings.savePlayerLifesteal)
		console.log(
			'Save Player Bullet Speed: ',
			gameSettings.savePlayerBulletSpeed,
		)
		console.log('Save Player Score: ', gameSettings.savePlayerScore)
		console.log(
			'Save Player Number Of Bullets: ',
			gameSettings.savePlayerNumberOfBullets,
		)
		console.log('Save Player Fire Rate: ', gameSettings.savePlayerFireRate)
		console.log(
			'Save Player Default Bullet Size: ',
			gameSettings.savePlayerDefaultBulletSize,
		)
		console.log('Save Player Bullet Size: ', gameSettings.savePlayerBulletSize)
		console.log('Save Player Max Health: ', gameSettings.savePlayerMaxHealth)
		console.log(
			'Save Player Upgrade Threshold: ',
			gameSettings.savePlayerUpgradeThreshold,
		)
		console.log('Save Player Size: ', gameSettings.savePlayerSize)
		console.log('Save Player Armor: ', gameSettings.savePlayerArmor)
		console.log(
			'Save Player Health Generation: ',
			gameSettings.savePlayerHealthGeneration,
		)
		console.log('Save Player Buff Rate: ', gameSettings.savePlayerBuffRate)
		console.log('Save Player Hard Mode: ', gameSettings.saveplayerHardMode)

		console.log('Player Index ', gameSettings.selectedPlayerIndex)
		console.log('Artifact Index ', gameSettings.selectedArtifactIndex)
		console.log('User Active ', gameSettings.userActive)
		console.log('Wallet Connected ', gameSettings.userWalletAdress)
	}

	update() {
		// update for mute and sound button
		if (this.music.musicOn === false && this.music.soundOn === false) {
			this.musicButton = this.add.image(config.width - 60, 30, 'mute_texture')
		} else if (this.music.musicOn === true && this.music.soundOn === true) {
			this.musicButton = this.add.image(config.width - 60, 30, 'sound_texture')
		}
		// Pause the game
		this.keyboardManager.pauseGame()

		// Move the background
		this.background.tilePositionY -= BACKGROUND_SCROLL_SPEED

		// Move the player and enemies
		this.PlayerManager.movePlayer()
		this.PlayerManager.healthPlayer()

		// this.EnemyManager.moveEnemies();
		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()

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

		if (this.EnemyManager.checkToFinishLevel()) {
			this.goToNextLevel()
			this.EnemyManager.gameStarted = false
		}
	}

	goToNextLevel() {
		createText(
			'LEVEL COMPLETED',
			config.width / 2,
			config.height / 2 - 60,
			5000,
			this,
		)

		// Check for Enter key press continuously in the update loop
		this.time.delayedCall(1000, handleEnterKey(this), [], this)
	}
}
export default LevelThreeScreen
