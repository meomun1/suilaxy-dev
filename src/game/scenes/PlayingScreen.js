import Phaser from 'phaser'
import config from '../config/config'
import Player from '../objects/players/Player'
import Shield from '../objects/utilities/Shield'
import EnemyManager from '../manager/EnemyManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PlayerManager from '../manager/PlayerManager.js'
import CollideManager from '../manager/CollideManager.js'
import Bug1 from '../objects/enemies/Bug1'
import Bug3 from '../objects/enemies/Bug3'
import Bug5 from '../objects/enemies/Bug5'
import GuiManager from '../manager/GuiManager.js'
import UtilitiesManager from '../manager/UtilitiesManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import UpgradeManager from '../manager/UpgradeManager.js'
import SoundManager from '../manager/SoundManager.js'
import MobileManager from '../manager/MobileManager.js'
import gameSettings from '../config/gameSettings.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class PlayingScreen extends Phaser.Scene {
	constructor() {
		super('playGame')
		this.callingScene = 'playGame'
		this.pic
	}

	init(data) {
		this.selectedPlayerIndex = data.number
	}

	preload() {
		this.load.image('pause', 'assets/spritesheets/vfx/pause.png')
		this.load.audio('desertMusic', 'assets/audio/playingMusic.mp3')
		this.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
		this.load.audio('shootSound', 'assets/audio/bullet.wav')
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

	create() {
		this.cameras.main.fadeIn(500, 0, 0, 0)

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

		// Create GUI for PlayingScreen ( Changes in BG except Player and Enemy )
		this.guiManager = new GuiManager(this)
		this.guiManager.createBackground('background_texture_01')
		// Add sound for playing screen
		this.music = this.sys.game.globals.music

		this.player = new Player(
			this,
			config.width / 2,
			config.height - 100,
			`player_texture_${this.selectedPlayerIndex}`,
			gameSettings.playerMaxHealth,
		)

		this.player.play('player_anim')
		this.player.restartGameSettings()
		this.player.selectedPlayer = this.selectedPlayerIndex

		// Spawn the Enemies
		this.time.delayedCall(
			21000,
			() => {
				// shoot straight bullet
				this.bug3_1 = new Bug3(this, config.width - 20, -20, 300, 1)
				this.bug3_2 = new Bug3(this, 20, -20, 300, 1)

				// shoot following bullet
				this.bug3_3 = new Bug3(this, 70, -20, 500, 1)
				this.bug3_4 = new Bug3(this, config.width - 70, -20, 500, 1)

				// chasing enemies
				this.bug5_1 = new Bug5(this, config.width / 2, -20, 200)
				this.bug5_2 = new Bug5(this, config.width / 2 - 50, -20, 200)
				this.bug5_3 = new Bug5(this, config.width / 2 + 50, -20, 200)
			},
			null,
			this,
		)

		// Create text for level 1
		this.createText('LEVEL 1', config.width / 2, config.height / 2 - 60, 2000)

		// Spawn the Shield
		this.shield = new Shield(this, this.player)
		this.shield.play('shield_anim')

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

		this.time.delayedCall(
			3000,
			() => {
				this.EnemyManager.spawnEnemyRowWithDelay(this, 0)
			},
			null,
			this,
		)

		this.time.delayedCall(
			6000,
			() => this.EnemyManager.spawnEnemyRowWithDelay(this, 0),
			null,
			this,
		)

		this.time.delayedCall(
			12000,
			() => this.EnemyManager.spawnEnemyRowWithDelay(this, 0),
			null,
			this,
		)

		this.time.delayedCall(
			21000,
			() => {
				this.EnemyManager.addEnemyForOnce(this.bug3_1)
				this.EnemyManager.addEnemyForOnce(this.bug3_2)
				this.EnemyManager.addEnemyForOnce(this.bug3_3)
				this.EnemyManager.addEnemyForOnce(this.bug3_4)
				this.EnemyManager.addEnemyForOnce(this.bug5_1)
				this.EnemyManager.addEnemyForOnce(this.bug5_2)
				this.EnemyManager.addEnemyForOnce(this.bug5_3)
			},
			null,
			this,
		)

		// FINAL WAVE
		this.time.delayedCall(
			45000,
			() => {
				this.startFinalWave()
			},
			null,
			this,
		)

		this.time.delayedCall(
			57000,
			() => {
				this.EnemyManager.gameStarted = true
			},
			null,
			this,
		)

		this.UtilitiesManager = new UtilitiesManager(this)
		this.SoundManager = new SoundManager(this)

		// Spawn the Health Packs and Shield Packs
		this.time.addEvent({
			delay: 20000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(1, 0)
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

		this.time.addEvent({
			delay: 30000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(0, 2)
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

		this.time.addEvent({
			delay: 40000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(1, 0)
				this.CollideManager3 = new CollideManager(
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

		this.projectileManager = new ProjectileManager(this)
		this.projectileManager.createPlayerBullet()
		this.projectileManager.createEnemyBullet()
		this.projectileManager.createChaseBullet()
		this.time.addEvent({
			delay: 21000,
			callback: () => {
				this.projectileManager.callEnemyBulletLv1()
				this.projectileManager.callChaseBulletLv1()
			},
			callbackScope: this,
		})

		// Create keyboard inputs
		this.spacebar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		)
		this.enter = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER,
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

		// this.time.delayedCall(
		//   58000,
		//   () => {
		//     this.time.delayedCall(
		//       1000,
		//       this.goToNextLevel,
		//       null,
		//       this
		//     );
		//   },
		//   null,
		//   this
		// );

		// create pause button
		this.pic = this.add.image(config.width - 20, 30, 'pause')
		// this.button = this.scene.add.sprite(60, 30, 'pause');
		this.pic.setInteractive()

		this.pic.on(
			'pointerdown',
			function () {
				this.scene.pause()
				this.scene.launch('pauseScreen', { key: 'playGame' })
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

		// this.EnemyManager.moveEnemies(); Dont need
		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

		this.EnemyManager.destroyEnemyMoveOutOfScreen()

		if (this.spacebar.isDown) {
			this.player.shootBullet(this.selectedPlayerIndex)
			// this.scene.sfx.missile.play();
		}

		this.projectiles.children.iterate((bullet) => {
			bullet.update()
		})

		if (this.player.health <= 0) {
			this.gameOver()
		}

		this.shield.updatePosition(this.player)

		if (this.EnemyManager.checkToFinishLevel()) {
			this.goToNextLevel()
			this.EnemyManager.gameStarted = false
		}

		this.time.addEvent({
			delay: 22000,
			callback: () => {
				this.bug3_1.rotateToPlayer(this.player)
				this.bug3_2.rotateToPlayer(this.player)
				this.bug3_3.rotateToPlayer(this.player)
				this.bug3_4.rotateToPlayer(this.player)
			},
			callbackScope: this,
		})

		this.time.addEvent({
			delay: 21000,
			callback: () => {
				this.bug5_1.chasePlayer(this.player)
				this.bug5_2.chasePlayer(this.player)
				this.bug5_3.chasePlayer(this.player)
			},
			callbackScope: this,
		})
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
		this.scene.stop()
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
					this.scene.start('playLevelTwo', {
						number: this.selectedPlayerIndex,
					})
				},
			)
		})
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
				this.finalWaveBugs = this.EnemyManager.spawnCircleOfBugsLv1(
					config.width / 2,
					config.height / 2 - 300,
					250,
					14,
				)
				this.finalWaveBugs = this.EnemyManager.spawnCircleOfBugsLv1(
					config.width / 2,
					config.height / 2 - 300,
					100,
					8,
				)
			},
			null,
			this,
		)
	}
}

export default PlayingScreen
