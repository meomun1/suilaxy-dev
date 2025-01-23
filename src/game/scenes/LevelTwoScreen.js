import Phaser from 'phaser'
import config from '../config/config'
import CollideManager from '../manager/CollideManager.js'
import Bug3 from '../objects/enemies/Bug3'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { createScene } from '../utils/initForGameScene.js'
import { loadImageLevelTwo } from '../utils/loadImage.js'
import { loadPlayerSpriteSheetNormal } from '../utils/loadSpriteSheets.js'
import { handleEnterKey, gameOver } from '../utils/endGamescene.js'
import { createText } from '../utils/createText.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class LevelTwoScreen extends Phaser.Scene {
	constructor() {
		super('playLevelTwo')
		this.callingScene = 'playLevelTwo'
	}

	init(data) {
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		loadImageLevelTwo(this)
		loadPlayerSpriteSheetNormal(this)
	}

	createLevelTwoText() {
		// Create text for level 2
		createText(
			'LEVEL 2: ACCELERATION - THEY ARE FASTER',
			config.width / 2,
			config.height / 2 - config.height / 8,
			2000,
			this,
		)
	}

	addEnemyLevelTwo() {
		// Spawn the Enemies
		this.time.delayedCall(
			13000,
			() => {
				// chasing enemies
				this.EnemyManager.spawnHalfCirleEnemeyChasePlayer(this, 1000)
			},
			null,
			this,
		)

		this.time.delayedCall(
			13000,
			() => {
				this.CollideManager2 = new CollideManager(
					this,
					this.player,
					this.EnemyManager.enemies,
					this.UtilitiesManager.HealthPacks,
					this.UtilitiesManager.shieldPacks,
					this.shield,
					this.SoundManager,
				)
			},
			null,
			this,
		)

		// Add a delayed event to spawn utilities after a delay
		this.time.addEvent({
			delay: 15000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(2, 2)
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

		// FINAL WAVE
		this.time.delayedCall(
			22000,
			() => {
				this.startFinalWave()
			},
			null,
			this,
		)

		this.time.delayedCall(
			32000,
			() => {
				this.EnemyManager.gameStarted = true
			},
			null,
			this,
		)

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

	createAsteroid() {
		this.asteroids = this.physics.add.group()

		// Create the asteroid spawning event
		this.asteroidSpawnEvent = this.time.addEvent({
			delay: 100,
			callback: this.spawnAsteroid,
			callbackScope: this,
			loop: true,
		})

		// Create a timer event to cancel the asteroid spawning event after 12 seconds
		this.time.addEvent({
			delay: 10000,
			callback: this.cancelAsteroidSpawn,
			callbackScope: this,
		})
	}

	spawnAsteroid() {
		const spawnEdge = Phaser.Math.Between(0, 3) // 0: top, 1: right, 2: bottom, 3: left
		let x, y, velocityX, velocityY

		switch (spawnEdge) {
			case 0: // Top
				x = Phaser.Math.Between(0, config.width)
				y = -50 // Spawn above the screen
				velocityX = Phaser.Math.Between(-200, 200)
				velocityY = Phaser.Math.Between(50, 200)
				break
			case 1: // Right
				x = config.width + 50 // Spawn to the right of the screen
				y = Phaser.Math.Between(0, config.height)
				velocityX = Phaser.Math.Between(-200, -50)
				velocityY = Phaser.Math.Between(-200, 200)
				break
			case 2: // Bottom
				x = Phaser.Math.Between(0, config.width)
				y = config.height + 50 // Spawn below the screen
				velocityX = Phaser.Math.Between(-200, 200)
				velocityY = Phaser.Math.Between(-200, -50)
				break
			case 3: // Left
				x = -50 // Spawn to the left of the screen
				y = Phaser.Math.Between(0, config.height)
				velocityX = Phaser.Math.Between(50, 200)
				velocityY = Phaser.Math.Between(-200, 200)
				break
		}

		const asteroidKey = `asteroid_${Phaser.Math.Between(1, 4)}`
		const asteroid = this.asteroids.create(x, y, asteroidKey)

		// Set velocity
		asteroid.setVelocity(velocityX, velocityY)
	}

	cancelAsteroidSpawn() {
		// Cancel the asteroid spawning event
		this.asteroidSpawnEvent.remove()
	}

	handleCollision(player, asteroid) {
		asteroid.destroy()
		player.takeDamage(50)
	}

	startFinalWave() {
		// Display "Final Wave" text for 2 seconds
		const finalWaveText = this.add
			.text(config.width / 2, config.height / 2, 'Final Wave', {
				fontFamily: 'Pixelify Sans',
				fontSize: '32px',
				fill: '#FFFB73',
			})
			.setOrigin(0.5)

		this.time.delayedCall(
			2000,
			() => {
				finalWaveText.destroy()

				// Spawn a wave of bugs after the "Final Wave" message disappears
				// shoot straight bullet
				this.miniBoss = new Bug3(this, config.width / 2, -20, 6000, 3)
				this.EnemyManager.addEnemyForOnce(this.miniBoss)

				const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

				this.bug3_2 = new Bug3(
					this,
					config.width / 2 + 200 * Math.cos(angles[0]) + config.width / 4,
					-20 + 200 * Math.sin(angles[0]),
					3000,
					1.5,
				)

				this.bug3_4 = new Bug3(
					this,
					config.width / 2 + 200 * Math.cos(angles[2]) - config.width / 4,
					-20 + 200 * Math.sin(angles[2]),
					3000,
					1.5,
				)

				this.EnemyManager.addEnemyForOnce(this.bug3_2)
				this.EnemyManager.addEnemyForOnce(this.bug3_4)
			},
			null,
			this,
		)
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.cameras.main.fadeIn(1000, 0, 0, 0)

		this.physics.world.setBounds(0, 0, config.width, config.height)

		// Creat GUI for PlayingScreen ( Changes in BG except Player and Enemy )
		this.guiManager = new GuiManager(this)
		this.guiManager.createBackground('background_texture')

		this.music = this.sys.game.globals.music

		this.createLevelTwoText()

		createScene(this)

		this.addEnemyLevelTwo()

		this.createAsteroid()

		this.physics.add.collider(
			this.player,
			this.asteroids,
			this.handleCollision,
			null,
			this,
		)
		this.selectedPlayerIndex = Number(gameSettings.selectedPlayerIndex)

		console.log('Level Two')
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

		// this.EnemyManager.moveEnemies(); Dont need at the moment
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

		this.time.addEvent({
			delay: 24500,
			callback: () => {
				this.miniBoss.rotateToPlayer(this.player)
				this.bug3_2.rotateToPlayer(this.player)
				this.bug3_4.rotateToPlayer(this.player)
			},
			callbackScope: this,
		})
	}

	goToNextLevel() {
		createText(
			'LEVEL COMPLETED',
			config.width / 2,
			config.height / 2 + 60,
			5000,
			this,
		)

		// Check for Enter key press continuously in the update loop
		this.time.delayedCall(1000, handleEnterKey(this), [], this)
	}
}
export default LevelTwoScreen
