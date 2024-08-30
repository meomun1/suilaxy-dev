import Phaser from 'phaser'
import config from '../config/config'
import Player from '../objects/players/Player'
import Shield from '../objects/utilities/Shield'
import EnemyManager from '../manager/EnemyManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PlayerManager from '../manager/PlayerManager.js'
import CollideManager from '../manager/CollideManager.js'
import Bug3 from '../objects/enemies/Bug3'
import Bug5 from '../objects/enemies/Bug5'
import GuiManager from '../manager/GuiManager.js'
import UtilitiesManager from '../manager/UtilitiesManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import UpgradeManager from '../manager/UpgradeManager.js'
import SoundManager from '../manager/SoundManager.js'
import MobileManager from '../manager/MobileManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class LevelThreeScreen extends Phaser.Scene {
	constructor() {
		super('playLevelThree')
		this.callingScene = 'playLevelThree'
		this.guiManager = new GuiManager(this)
	}

	init(data) {
		this.selectedPlayerIndex = data.number
	}

	preload() {
		this.load.spritesheet({
			key: `player_texture_${this.selectedPlayerIndex}`,
			url: `assets/spritesheets/players/planes_0${this.selectedPlayerIndex}A.png`,
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		})
	}

	createLevelThreeText() {
		// Create text for level 3
		this.createText(
			'LEVEL 3: FLEXIBILITY',
			config.width / 2,
			config.height / 2 - 60,
			2000,
		)

		this.time.delayedCall(
			16000,
			() => {
				this.createText(
					'Try your best to survive!',
					config.width / 2,
					config.height / 2 - 60,
					2000,
				)
			},
			null,
			this,
		)
	}

	createShipAnims() {
		if (
			!(this.anims && this.anims.exists && this.anims.exists('player_anim'))
		) {
			this.anims.create({
				key: 'player_anim',
				frames: this.anims.generateFrameNumbers(
					`player_texture_${this.selectedPlayerIndex}`,
					{
						start: 0,
						end: 3,
					},
				),
				frameRate: 30,
				repeat: -1,
			})

			this.anims.create({
				key: 'player_anim_left',
				frames: this.anims.generateFrameNumbers(
					`player_texture_${this.selectedPlayerIndex}`,
					{
						start: 4,
						end: 7,
					},
				),
				frameRate: 30,
				repeat: -1,
			})

			this.anims.create({
				key: 'player_anim_left_diagonal',
				frames: this.anims.generateFrameNumbers(
					`player_texture_${this.selectedPlayerIndex}`,
					{
						start: 8,
						end: 11,
					},
				),
				frameRate: 30,
				repeat: -1,
			})

			this.anims.create({
				key: 'player_anim_right',
				frames: this.anims.generateFrameNumbers(
					`player_texture_${this.selectedPlayerIndex}`,
					{
						start: 12,
						end: 15,
					},
				),
				frameRate: 30,
				repeat: -1,
			})

			this.anims.create({
				key: 'player_anim_right_diagonal',
				frames: this.anims.generateFrameNumbers(
					`player_texture_${this.selectedPlayerIndex}`,
					{
						start: 16,
						end: 19,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}
	}

	createObject() {
		// PLAYER
		this.player = new Player(
			this,
			config.width / 2,
			config.height - config.height / 4,
			`player_texture_${this.selectedPlayerIndex}`,
			gameSettings.playerMaxHealth,
		)
		this.player.play('player_anim')
		this.player.restartGameSettings()
		this.player.selectedPlayer = this.selectedPlayerIndex

		//SHIELD
		this.shield = new Shield(this, this.player)
		this.shield.play('shield_anim')
	}

	createMechanic() {
		// Create keyboard inputs
		this.spacebar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		)
		this.enter = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER,
		)

		this.projectileManager = new ProjectileManager(this)
		this.projectileManager.createPlayerBullet()
		this.projectileManager.createEnemyBullet()
		this.projectileManager.createChaseBullet()
	}

	createManager() {
		// Create managers
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.mobileManager = new MobileManager(this)
		this.keyboardManager.MuteGame()
		// Score System
		this.UpgradeManager = new UpgradeManager(this, this.callingScene)
		this.PlayerManager = new PlayerManager(
			this,
			this.player,
			this.selectedPlayerIndex,
		)

		this.EnemyManager = new EnemyManager(this)
		this.UtilitiesManager = new UtilitiesManager(this)
		this.SoundManager = new SoundManager(this)
	}

	createMusic() {
		// create pause button
		this.pic = this.add.image(config.width - 20, 30, 'pause')
		this.pic.setInteractive()

		this.pic.on(
			'pointerdown',
			function () {
				this.scene.pause()
				this.scene.launch('pauseScreen', { key: 'playLevelThree' })
			},
			this,
		)

		this.musicButton = this.add.image(config.width - 60, 30, 'sound_texture')
		this.musicButton.setInteractive()

		this.musicButton.on(
			'pointerdown',
			function () {
				this.music.soundOn = !this.music.soundOn
				this.music.musicOn = !this.music.musicOn

				this.updateAudio()
			},
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

		this.createShipAnims()

		this.createLaserPolygon()

		this.createObject()

		this.createMechanic()

		this.createManager()

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

		// this.EnemyManager.moveEnemies();
		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()

		if (this.spacebar.isDown) {
			this.player.shootBullet(this.selectedPlayerIndex)
		}

		this.projectiles.children.iterate((bullet) => {
			if (bullet) {
				bullet.update()
			}
		})

		if (this.player.health <= 0) {
			this.gameOver()
		}

		this.shield.updatePosition(this.player)

		if (this.EnemyManager.checkToFinishLevel()) {
			this.goToNextLevel()
			this.EnemyManager.gameStarted = false
		}
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

	shutdownPlayer() {
		this.events.once('shutdown', this.shutdown, this)
	}

	gameOver() {
		this.events.once('shutdown', this.shutdown, this)
		this.scene.stop('upgradeScreen')
		this.scene.start('gameOver', { key: this.callingScene })
	}

	shutdown() {
		// Remove entire texture along with all animations
		this.textures.remove(`player_texture_${this.selectedPlayerIndex}`)

		// Check if the animation exists before trying to remove it
		if (this.anims && this.anims.exists && this.anims.exists('player_anim')) {
			this.anims.remove('player_anim')
		}
		if (
			this.anims &&
			this.anims.exists &&
			this.anims.exists('player_anim_left')
		) {
			this.anims.remove('player_anim_left')
		}
		if (
			this.anims &&
			this.anims.exists &&
			this.anims.exists('player_anim_left_diagonal')
		) {
			this.anims.remove('player_anim_left_diagonal')
		}
		if (
			this.anims &&
			this.anims.exists &&
			this.anims.exists('player_anim_right')
		) {
			this.anims.remove('player_anim_right')
		}
		if (
			this.anims &&
			this.anims.exists &&
			this.anims.exists('player_anim_right_diagonal')
		) {
			this.anims.remove('player_anim_right_diagonal')
		}
	}

	createText(key, x, y, time) {
		const Level1Text = this.add
			.text(x, y, key, {
				fontFamily: 'Pixelify Sans',
				fontSize: '32px',
				fill: '#FFFB73',
			})
			.setOrigin(0.5)

		this.time.delayedCall(
			time,
			() => {
				Level1Text.destroy()
			},
			null,
			this,
		)
	}

	goToNextLevel() {
		this.createText(
			'LEVEL COMPLETED',
			config.width / 2,
			config.height / 2 - 60,
			5000,
		)

		// Check for Enter key press continuously in the update loop
		this.time.delayedCall(1000, this.handleEnterKey, [], this)
	}

	handleEnterKey() {
		this.scene.stop('upgradeScreen')
		this.player.savePlayer()
		this.time.delayedCall(1000, () => {
			this.cameras.main.fadeOut(1000, 0, 0, 0)

			this.cameras.main.once(
				Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
				(cam, effect) => {
					this.scene.stop()
					this.scene.start('powerScreen', {
						number: this.selectedPlayerIndex,
						callingScene: this.callingScene,
					})
				},
			)
		})
	}
}
export default LevelThreeScreen
