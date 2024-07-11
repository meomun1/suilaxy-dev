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
		gameSettings.isBossDead = true
		// global music
		this.music = this.sys.game.globals.music

		// Create player animations
		this.guiManager.createBackground('background_texture_03')

		this.guiManager.createTextWithDelay(
			'Press SPACE to shoot',
			config.width / 2,
			config.height / 2 - 60,
			'Pixelify Sans',
			'28px',
			'#ffffff',
			0.5,
			4000,
		)

		this.guiManager.createTextWithDelay(
			'Use Arrow Keys to move',
			config.width / 2,
			config.height / 2 - 30,
			'Pixelify Sans',
			'28px',
			'#ffffff',
			0.5,
			4000,
		)

		// CALL TEXT AFTER 6 SECONDS
		this.time.delayedCall(
			6000,
			() => {
				this.guiManager.createTextWithDelay(
					'Press P to pause the game',
					config.width / 2,
					config.height / 2 - 60,
					'Pixelify Sans',
					'28px',
					'#ffffff',
					0.5,
					4000,
				)

				this.guiManager.createTextWithDelay(
					'Take down the enemy for upgrade',
					config.width / 2,
					config.height / 2 - 100,
					'Pixelify Sans',
					'28px',
					'#ffffff',
					0.5,
					4000,
				)
			},
			null,
			this,
		)

		// CALL TEXT AFTER 10 SECONDS
		this.time.delayedCall(
			10000,
			() => {
				this.guiManager.createSimpleText(
					config.width / 2,
					config.height / 2 - 60,
					"Ready? Let's start",
					'25px',
					'#ffffff',
					0.5,
				)
			},
			null,
			this,
		)

		// Spawn the Player
		this.player = new Player(
			this,
			config.width / 2,
			config.height - 100,
			`player_texture_${this.selectedPlayerIndex}`,
			gameSettings.playerMaxHealth,
		)

		this.player.play('player_anim')
		this.player.restartToTile()
		this.player.selectedPlayer = this.selectedPlayerIndex

		this.shield = new Shield(this, this.player)
		this.shield.play('shield_anim')

		// Create managers
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.keyboardManager.MuteGame()

		this.mobileManager = new MobileManager(this)

		this.PlayerManager = new PlayerManager(this, this.player)

		this.UtilitiesManager = new UtilitiesManager(this)

		this.EnemyManager = new EnemyManager(this)
		this.time.delayedCall(
			3000,
			() => {
				this.EnemyManager.addEnemyTutorial()
				this.EnemyManager.gameStarted = true
			},
			null,
			this,
		)

		// Create keyboard inputs
		this.spacebar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		)

		// Create a group to manage bullets
		this.projectileManager = new ProjectileManager(this)
		this.projectileManager.createPlayerBullet()
		this.projectileManager.createEnemyBullet()
		this.projectileManager.createChaseBullet()

		this.CollideManager = new CollideManager(
			this,
			this.player,
			this.EnemyManager.enemies,
			this.UtilitiesManager.HealthPacks,
			this.UtilitiesManager.shieldPacks,
			this.shield,
		)

		// Score System
		this.UpgradeManager = new UpgradeManager(this, this.callingScene)

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

	update() {
		// update for mute and sound button
		if (this.music.musicOn === false && this.music.soundOn === false) {
			this.musicButton = this.add.image(config.width - 60, 30, 'mute_texture')
		} else if (this.music.musicOn === true && this.music.soundOn === true) {
			this.musicButton = this.add.image(config.width - 60, 30, 'sound_texture')
		}

		// Pause the game
		this.keyboardManager.pauseGame()
		this.keyboardManager.titleScreen()

		// Move the background
		this.background.tilePositionY -= BACKGROUND_SCROLL_SPEED

		// Move the player and enemies
		this.PlayerManager.movePlayer()

		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()

		if (this.spacebar.isDown) {
			this.player.shootBullet(this.selectedPlayerIndex)
		}

		this.projectiles.children.iterate((bullet) => {
			bullet.update()
		})

		this.shield.updatePosition(this.player)

		if (this.player.health <= 0) {
			this.gameOver()
		}

		if (this.EnemyManager.checkToFinishLevel()) {
			this.startGame()
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
					this.scene.start('playGame', { number: this.selectedPlayerIndex })
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
