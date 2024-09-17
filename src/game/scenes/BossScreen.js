import Phaser from 'phaser'
import config from '../config/config.js'
import Player from '../objects/players/Player.js'
import Shield from '../objects/utilities/Shield.js'
import EnemyManager from '../manager/EnemyManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PlayerManager from '../manager/PlayerManager.js'
import CollideManager from '../manager/CollideManager.js'
import Bug3 from '../objects/enemies/Bug3.js'
import Bug5 from '../objects/enemies/Bug5.js'
import GuiManager from '../manager/GuiManager.js'
import UtilitiesManager from '../manager/UtilitiesManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import UpgradeManager from '../manager/UpgradeManager.js'
import Boss from '../objects/enemies/Boss.js'
import MiniBot from '../objects/enemies/Minibot.js'
import SoundManager from '../manager/SoundManager.js'
import MobileManager from '../manager/MobileManager.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import SpecialPlayers from '../objects/players/SpecialPlayers.js'

const BACKGROUND_SCROLL_SPEED = 0.5
class BossScreen extends Phaser.Scene {
	constructor() {
		super('bossGame')
		this.callingScene = 'bossGame'
		this.guiManager = new GuiManager(this)
		this.spawnedEnemies = []
	}

	init(data) {
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		this.load.spritesheet({
			key: `player_texture_${this.selectedPlayerIndex}`,
			url: `assets/spritesheets/players/planes_0${this.selectedPlayerIndex}B.png`,
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		})
	}

	createText() {
		const bossText = this.add
			.text(config.width / 2, config.height / 2, 'Boss', {
				fontFamily: 'Pixelify Sans',
				fontSize: '64px',
				fill: '#FFFB73',
			})
			.setOrigin(0.5)

		this.time.delayedCall(
			2000,
			() => {
				bossText.destroy()
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
		this.player = new SpecialPlayers(
			this,
			config.width / 2,
			config.height - config.height / 4,
			`player_texture_${this.selectedPlayerIndex}`,
			gameSettings.playerMaxHealth,
			gameSettings.selectedPlayerIndex,
		)
		this.player.play('player_anim')
		this.player.restartGameSettings()

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
		if (this.selectedPlayerIndex === 6) {
			this.projectileManager.createShieldCover()
		} else if (this.selectedPlayerIndex === 8) {
			this.projectileManager.createWingCover()
		} else if (this.selectedPlayerIndex === 1) {
			this.projectileManager.createRandomBullet()
		} else {
			this.projectileManager.createPlayerBullet()
		}

		this.projectileManager.createEnemyEffect()
		this.projectileManager.createEffect()
		this.projectileManager.createEnemyBullet()
		this.projectileManager.createChaseBullet()
		this.projectileManager.callEnemyBulletBoss()
		this.projectileManager.callChaseBulletBoss()
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
				this.scene.launch('pauseScreen', { key: 'playLevelTwo' })
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

	addEnemyLevelBoss() {
		this.boss = new Boss(this, config.width / 2, 0, 50000)
		this.boss.play('boss_move_anim')

		this.firstMini = new MiniBot(this, config.width / 5, -96, 10000)
		this.secondMini = new MiniBot(this, (config.width * 4) / 5, -96, 10000)

		// Spawn the Enemies
		this.bug3_1 = new Bug3(this, 50, 0, 2000)
		this.bug3_1.play('bug3_anim')
		this.bug3_1.setScale(2)
		this.bug3_2 = new Bug3(this, config.width - 50, 0, 2000)
		this.bug3_2.play('bug3_anim')
		this.bug3_2.setScale(2)

		this.bug5 = new Bug5(this, config / 4, 0, 1000, 2)
		this.bug5.play('bug5_anim')

		this.bug5_2 = new Bug5(this, (3 * config) / 4, 0, 1000, 2)
		this.bug5_2.play('bug5_anim')

		this.EnemyManager.addEnemy(this.bug3_1)
		this.EnemyManager.addEnemy(this.bug3_2)
		this.EnemyManager.addEnemy(this.bug5)
		this.EnemyManager.addEnemy(this.bug5_2)
		this.EnemyManager.addEnemy(this.boss)
		this.EnemyManager.addEnemy(this.firstMini)
		this.EnemyManager.addEnemy(this.secondMini)

		// spawn the enemies
		if (this.boss.health < 800) {
			this.time.delayedCall(
				100,
				() => {
					this.bossBelow80HP()
				},
				null,
				this,
			)
		}
		// Add a delayed event to spawn utilities after a delay
		this.time.addEvent({
			delay: 5000,
			callback: () => {
				this.UtilitiesManager.addUtilitiesForPlayingScreen(3, 4)

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
	}

	create() {
		// Creat GUI for PlayingScreen ( Changes in BG except Player and Enemy )
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.guiManager.createBackground('background_texture_04')

		this.music = this.sys.game.globals.music

		this.createText()

		this.createShipAnims()

		this.createObject()

		this.createMechanic()

		this.createManager()

		this.addEnemyLevelBoss()

		this.CollideManager = new CollideManager(
			this,
			this.player,
			this.EnemyManager.enemies,
			this.UtilitiesManager.HealthPacks,
			this.UtilitiesManager.shieldPacks,
			this.shield,
			this.SoundManager,
		)

		this.bossDefeated = false
		this.checkBossHeal = false
		this.timeHealth = 1

		this.createMusic()
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
		if (this.player.health > 0) {
			this.PlayerManager.movePlayer()
			this.PlayerManager.healthPlayer()
		}

		this.EnemyManager.moveEnemies()

		this.EnemyManager.enemies.forEach((enemy) => {
			enemy.updateHealthBarPosition()
		})

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
			bullet.update(this.player)
		})

		this.projectilesEnemyEffects.children.iterate((effect) => {
			if (effect) {
				effect.update()
			}
		})

		if (this.player.health <= 0) {
			this.gameOver()
		}

		this.shield.updatePosition(this.player)
		this.bug3_1.rotateToPlayer(this.player)
		this.bug3_2.rotateToPlayer(this.player)
		this.bug5.chasePlayer(this.player, 200)
		this.bug5_2.chasePlayer(this.player, 200)

		if (this.boss.health <= 0) {
			// Destroy all spawned enemies
			this.EnemyManager.enemies.forEach((enemy) => {
				if (enemy.health > 0) {
					enemy.takeDamage(100000)
				}
			})

			if (gameSettings.isBossDead === true) {
				this.UtilitiesManager.addNftForPlayer()

				this.CollideManager1 = new CollideManager(
					this,
					this.player,
					this.EnemyManager.enemies,
					this.UtilitiesManager.HealthPacks,
					this.UtilitiesManager.shieldPacks,

					this.shield,
					this.SoundManager,
				)

				gameSettings.isBossDead = false
			}

			this.time.delayedCall(
				5000,
				() => {
					this.scene.start('createNft')
				},
				null,
				this,
			)
		}

		if (this.boss.health > 0) {
			this.bossProcess()
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

	enemyExploded() {
		this.EnemyManager.enemyExploded()
	}

	bossProcess() {
		if (
			this.boss.health < this.boss.maxHealth * 0.8 &&
			this.boss.health > this.boss.maxHealth * 0.55
		) {
			this.boss.moveToCenter()
		}

		if (
			this.boss.health < this.boss.maxHealth * 0.55 &&
			this.boss.health >= this.boss.maxHealth * 0.35
		) {
			this.boss.bossBound()
			if (this.timeHealth === 0) {
				this.callMini()
			}
		}

		if (this.boss.health < this.boss.maxHealth * 0.35 && this.boss.health > 0) {
			this.boss.moveToCenter()
			this.callMini()
		}

		if (
			this.checkBossHeal === true &&
			this.boss.health < this.boss.maxHealth * 0.35
		) {
			this.healthBoss()
			this.boss.updateHealthBarValue(this.boss.health, this.boss.maxHealth)
			if (this.boss.health >= this.boss.maxHealth * 0.35) {
				this.checkBossHeal = false
			}
		}

		if (
			this.boss.health < this.boss.maxHealth * 0.2 &&
			this.checkBossHeal === false &&
			this.timeHealth === 1
		) {
			this.checkBossHeal = true
			this.timeHealth = 0
		}

		if (this.boss.health < this.boss.maxHealth * 0.15 && this.boss.health > 0) {
			this.boss.shootBulletCircle(this, this.boss)
		}
	}

	callMini() {
		if (this.firstMini.health > 0) {
			this.firstMini.followPlayer(this.player, -100, -100)
		}

		if (this.secondMini.health > 0) {
			this.secondMini.followPlayer(this.player, 100, -100)
		}
	}

	healthBoss() {
		if (this.boss.health < this.boss.maxHealth * 0.35) {
			this.boss.health += this.boss.maxHealth * 0.02
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
}
export default BossScreen
