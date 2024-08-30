import Phaser from 'phaser'
import config from '../config/config'
import Player from '../objects/players/Player'
import Shield from '../objects/utilities/Shield'
import EnemyManager from '../manager/EnemyManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PlayerManager from '../manager/PlayerManager.js'
import CollideManager from '../manager/CollideManager.js'
import GuiManager from '../manager/GuiManager.js'
import UtilitiesManager from '../manager/UtilitiesManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import UpgradeManager from '../manager/UpgradeManager.js'
import MobileManager from '../manager/MobileManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class TutorialScreen extends Phaser.Scene {
	constructor() {
		super('playTutorial')
		this.callingScene = 'playTutorial'
		this.guiManager = new GuiManager(this)
	}

	init(data) {
		this.selectedPlayerIndex = data.number
	}

	preload() {
		this.load.image('pause', 'assets/spritesheets/vfx/pause.png')
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		gameSettings.isBossDead = true
		// global music
		this.music = this.sys.game.globals.music
		// Create player animations

		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background_texture_03',
		)
		this.background.setOrigin(0, 0)

		this.createTutorialText()

		this.createObject()

		this.createMechanic()

		this.createManager()

		this.createMusic()

		this.addEnemyTutorial()

		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.CollideManager = new CollideManager(
			this,
			this.player,
			this.EnemyManager.enemies,
			this.UtilitiesManager.HealthPacks,
			this.UtilitiesManager.shieldPacks,
			this.shield,
		)
	}

	createTutorialText() {}

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
		this.player.restartToTile()
		this.player.selectedPlayer = this.selectedPlayerIndexs

		//SHIELD
		this.shield = new Shield(this, this.player)
		this.shield.play('shield_anim')
	}

	createMechanic() {
		// Create keyboard inputs
		// Create a group to manage bullets
		this.projectileManager = new ProjectileManager(this)
		this.projectileManager.createPlayerBullet()
		this.projectileManager.createEnemyBullet()
		this.projectileManager.createChaseBullet()
	}

	createManager() {
		// Create managers
		this.mobileManager = new MobileManager(this)
		this.UtilitiesManager = new UtilitiesManager(this)
		this.EnemyManager = new EnemyManager(this)
		this.UpgradeManager = new UpgradeManager(this, this.callingScene)
	}

	createMusic() {
		this.musicButton = this.add.image(
			config.width - config.width / 16,
			config.height / 16,
			'sound_texture',
		)
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

	addEnemyTutorial() {
		this.time.delayedCall(
			3000,
			() => {
				this.EnemyManager.addEnemyTutorial()
			},
			null,
			this,
		)

		this.time.delayedCall(
			4500,
			() => {
				this.supportTutorial()
			},
			null,
			this,
		)

		this.time.delayedCall(10000, () => {}, null, this)
	}

	supportTutorial() {
		this.lights.enable().setAmbientColor(0x686f76)

		let enemy

		this.background.setPipeline('Light2D')

		for (let i = 0; i < this.EnemyManager.enemies.length; i++) {
			if (this.EnemyManager.enemies[i]) {
				enemy = this.EnemyManager.enemies[i]
			}
		}

		enemy.setPipeline('Light2D')

		this.player.setPipeline('Light2D')

		const light = this.lights
			.addLight(80, 80, 100)
			.setColor(0xffffff)
			.setIntensity(0.5)
		light.x = config.width / 2
		light.y = config.height - config.height / 4

		enemy.setVelocityY(0)

		this.time.delayedCall(
			1000,
			() => {
				this.guiManager.createTextWithDelay(
					'Here is your spaceship',
					config.width / 2 + config.width / 8,
					config.height - config.height / 4,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			1500,
			() => {
				this.guiManager.createTextWithDelay(
					'Press SPACE to shoot',
					config.width / 2 + config.width / 8,
					config.height - config.height / 4 + config.height / 16,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			2000,
			() => {
				this.guiManager.createTextWithDelay(
					'User arrow keys or WASD to move',
					config.width / 2 + config.width / 8,
					config.height - config.height / 4 + config.height / 8,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			5500,
			() => {
				light.x = enemy.x
				light.y = enemy.y
			},
			null,
			this,
		)

		this.time.delayedCall(
			6000,
			() => {
				this.guiManager.createTextWithDelay(
					'Here is your enemy',
					enemy.x - config.width / 4 + config.width / 8,
					enemy.y - config.height / 16,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			6500,
			() => {
				this.guiManager.createTextWithDelay(
					'Destroy them will give you points',
					enemy.x - config.width / 4 + config.width / 16,
					enemy.y,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			7000,
			() => {
				this.guiManager.createTextWithDelay(
					'1000 / 1500 / 2000 points will give you an upgrade',
					enemy.x - config.width / 4,
					enemy.y + config.height / 16,
					'Pixelify Sans',
					`${config.height / 32}px`,
					'#ffffff',
					0.5,
					3000,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			10500,
			() => {
				this.guiManager.createTextWithDelay(
					'It is time to start the game, good luck',
					config.width / 2,
					config.height / 2,
					'Pixelify Sans',
					`${config.height / 20}px`,
					'#ffffff',
					0.5,
					3000,
				)
				light.x = 0
				light.y = 0
			},
			null,
			this,
		)
		this.time.delayedCall(
			13500,
			() => {
				this.lights.enable().setAmbientColor(0xffffff)
				enemy.setVelocityY(gameSettings.enemySpeed / 2)

				this.keyboardManager = new KeyboardManager(this)
				this.keyboardManager.MuteGame()
				this.PlayerManager = new PlayerManager(this, this.player)

				this.spacebar = this.input.keyboard.addKey(
					Phaser.Input.Keyboard.KeyCodes.SPACE,
				)
			},
			null,
			this,
		)

		this.time.delayedCall(
			15000,
			() => {
				this.guiManager.createTextWithDelay(
					'Tutorial Completed',
					config.width / 2,
					config.height / 2,
					'Pixelify Sans',
					`${config.height / 16}px`,
					'#ffffff',
					0.5,
					3000,
				)
				this.EnemyManager.gameStarted = true
			},
			null,
			this,
		)
	}

	update() {
		// update for mute and sound button
		if (this.music.musicOn === false && this.music.soundOn === false) {
			this.musicButton = this.add.image(
				config.width - config.width / 16,
				config.height / 16,
				'mute_texture',
			)
		} else if (this.music.musicOn === true && this.music.soundOn === true) {
			this.musicButton = this.add.image(
				config.width - config.width / 16,
				config.height / 16,
				'sound_texture',
			)
		}

		// Pause the game or go to title screen
		if (this.keyboardManager === undefined) {
		} else {
			this.keyboardManager.pauseGame()
			this.keyboardManager.titleScreen()
		}

		// Move the background
		this.background.tilePositionY -= BACKGROUND_SCROLL_SPEED

		this.time.delayedCall(
			13500,
			() => {
				if (this.PlayerManager) {
					this.PlayerManager.movePlayer()
				}
			},
			null,
			this,
		)

		if (this.player.health <= 0) {
			this.gameOver()
		}

		if (this.spacebar && this.spacebar.isDown) {
			this.player.shootBullet(this.selectedPlayerIndex)
		}

		this.projectiles.children.iterate((bullet) => {
			bullet.update()
		})

		// ENEMY
		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()

		if (this.EnemyManager.checkToFinishLevel()) {
			this.startGame()
			this.EnemyManager.gameStarted = false
		}

		//SHIELD
		this.shield.updatePosition(this.player)
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

	startGame() {
		this.scene.stop('upgradeScreen')

		this.time.delayedCall(3000, () => {
			this.cameras.main.fadeOut(1000, 0, 0, 0)

			this.cameras.main.once(
				Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
				(cam, effect) => {
					this.scene.stop()
					this.scene.start('playGame', {
						callingScene: this.callingScene,
						number: this.selectedPlayerIndex,
					})
				},
			)
		})
	}

	gameOver() {
		this.scene.start('gameOver', { key: this.callingScene })
		this.scene.stop('upgradeScreen')
		this.scene.stop()
		this.events.once('shutdown', this.shutdown, this)
	}

	shutdownPlayer() {
		this.events.once('shutdown', this.shutdown, this)
	}
}
export default TutorialScreen
