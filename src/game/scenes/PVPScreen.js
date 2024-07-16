import Phaser from 'phaser'
import config from '../config/config.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import io from 'socket.io-client'
import Player from '../objects/players/Player'
import gameSettings from '../config/gameSettings.js'
import PlayerManager from '../manager/PlayerManager.js'
import SoundManager from '../manager/SoundManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PVPManager from '../manager/PVPManager.js'

let playerManager
let player
let opponent
let mainSprite
let opponentSprite
const BACKGROUND_SCROLL_SPEED = 0.5

class PVPScreen extends Phaser.Scene {
	constructor() {
		super('pvpScreen')
		this.music = null
		this.bgMusic = null
		this.guiManager = new GuiManager(this)
		this.selectedPlayerIndex1 = 1
		this.selectedPlayerIndex2 = 2
	}

	init(data) {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
		this.selectedPlayerIndex = data.number
	}

	preload() {
		this.load.image('pause', 'assets/spritesheets/vfx/pause.png')
		this.load.audio('desertMusic', 'assets/audio/playingMusic.mp3')
		this.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
		this.load.audio('shootSound', 'assets/audio/bullet.wav')
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')

		this.load.image(
			'background_texture_pvp',
			'assets/images/backgrounds/purple/nebula_1.png',
		)

		// Correctly loading spritesheets
		this.load.spritesheet({
			key: `player_texture_${this.selectedPlayerIndex1}`,
			url: `assets/spritesheets/players/planes_0${this.selectedPlayerIndex1}A.png`,
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		})

		this.load.spritesheet({
			key: `player_texture_${this.selectedPlayerIndex2}`,
			url: `assets/spritesheets/players/planes_0${this.selectedPlayerIndex2}A.png`,
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		})

		this.guiManager.loadSpriteSheet(
			'bullet1_texture',
			'assets/spritesheets/vfx/bullet1.png',
			32,
			11,
			0,
			1,
		)

		this.guiManager.loadSpriteSheet(
			'bullet2_texture',
			'assets/spritesheets/vfx/bullet2.png',
			25,
			33,
			0,
			5,
		)

		this.guiManager.loadSpriteSheet(
			'explosion_texture',
			'assets/spritesheets/vfx/explosion.png',
			100,
			100,
			0,
			11,
		)
	}

	create() {
		this.socket = io('http://localhost:3000')

		this.anims.create({
			key: 'explosion_anim',
			frames: this.anims.generateFrameNumbers('explosion_texture', {
				start: 0,
				end: 10,
			}),
			frameRate: 30,
			repeat: 0,
			hideOnComplete: true,
		})

		// Create player animations
		this.createPlayerAnimations(this.selectedPlayerIndex1)
		this.createPlayerAnimations(this.selectedPlayerIndex2)
		this.createBulletAnimations(this.selectedPlayerIndex1)
		this.createBulletAnimations(this.selectedPlayerIndex2)

		this.players = this.add.group()

		this.createLobbyUI()
		this.setupSocketListeners()

		this.spacebar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		)
		this.enter = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER,
		)
		this.SoundManager = new SoundManager(this)
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.projectileManager = new ProjectileManager(this)

		this.projectileManager.createPVPBulletPlayer()
		this.projectileManager.createPVPBulletOpponent()
	}

	createPlayerAnimations(selectedPlayerIndex) {
		this.anims.create({
			key: `player_anim_${selectedPlayerIndex}`,
			frames: this.anims.generateFrameNumbers(
				`player_texture_${selectedPlayerIndex}`,
				{
					start: 0,
					end: 3,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		this.anims.create({
			key: `player_anim_left_${selectedPlayerIndex}`,
			frames: this.anims.generateFrameNumbers(
				`player_texture_${selectedPlayerIndex}`,
				{
					start: 4,
					end: 7,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		this.anims.create({
			key: `player_anim_left_diagonal_${selectedPlayerIndex}`,
			frames: this.anims.generateFrameNumbers(
				`player_texture_${selectedPlayerIndex}`,
				{
					start: 8,
					end: 11,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		this.anims.create({
			key: `player_anim_right_${selectedPlayerIndex}`,
			frames: this.anims.generateFrameNumbers(
				`player_texture_${selectedPlayerIndex}`,
				{
					start: 12,
					end: 15,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		this.anims.create({
			key: `player_anim_right_diagonal_${selectedPlayerIndex}`,
			frames: this.anims.generateFrameNumbers(
				`player_texture_${selectedPlayerIndex}`,
				{
					start: 16,
					end: 19,
				},
			),
			frameRate: 30,
			repeat: -1,
		})
	}

	createBulletAnimations(selectedPlayerIndex) {
		this.anims.create({
			key: `bullet${selectedPlayerIndex}_anim`,
			frames: this.anims.generateFrameNumbers(
				`bullet${selectedPlayerIndex}_texture`,
				{
					start: 0,
					end: 1,
				},
			),
			frameRate: 12,
			repeat: -1,
		})
	}

	createMusic() {
		this.music = this.sys.game.globals.music
	}

	createBlackCover() {
		let blackCover = this.add.rectangle(
			0,
			0,
			config.width,
			config.height,
			0x00000010,
		)
		blackCover.setOrigin(0, 0)
		blackCover.setDepth(100)

		this.tweens.add({
			targets: blackCover,
			alpha: 0,
			duration: 2500,
			onComplete: () => {
				blackCover.destroy()
			},
		})
	}

	createLobbyUI() {
		this.createMusic()

		this.guiManager.createBackground('background_texture_pvp')

		this.createBlackCover()
	}

	setupSocketListeners() {
		this.socket.on('currentPlayers', (players) => {
			Object.keys(players).forEach((id) => {
				if (players[id].playerId === this.socket.id) {
					this.addPlayer(this, players[id])
				} else {
					this.addOtherPlayers(this, players[id])
				}
			})
		})

		this.socket.on('newPlayer', (playerInfo) => {
			this.addOtherPlayers(this, playerInfo)
		})

		this.socket.on('playerDisconnected', (playerId) => {
			this.players.getChildren().forEach((player) => {
				if (playerId === player.playerId) {
					player.destroy()
				}
			})
		})

		this.socket.on('playerMoved', (playerInfo) => {
			opponent.setPosition(playerInfo.x, playerInfo.y)
		})

		this.socket.on('playerAnimation', (data) => {
			opponent.play(data.animationKey)
		})

		this.socket.on('opponentShootBullet', (bulletData) => {
			this.createOpponentBullet(bulletData)
		})

		this.socket.on('gameFull', () => {
			alert('Game is full')
		})
	}

	addPlayer(self, playerInfo) {
		let spriteKey

		if (playerInfo.playerNumber === 1) {
			spriteKey = this.selectedPlayerIndex1
			opponentSprite = this.selectedPlayerIndex2
		} else {
			spriteKey = this.selectedPlayerIndex2
			opponentSprite = this.selectedPlayerIndex1
		}

		mainSprite = spriteKey

		player = new Player(
			self,
			config.width / 2,
			(config.height * 4) / 5,
			`player_texture_${spriteKey}`,
			gameSettings.playerMaxHealth,
		)

		player.play(`player_anim_${spriteKey}`)
		player.restartToTile()

		player.playerId = playerInfo.playerId
		self.players.add(player)
		playerManager = new PlayerManager(self, player, spriteKey)
		this.initializePVPManager()
	}

	addOtherPlayers(self, playerInfo) {
		let spriteKey

		if (playerInfo.playerNumber === 1) {
			spriteKey = this.selectedPlayerIndex1
		} else {
			spriteKey = this.selectedPlayerIndex2
		}

		opponent = new Player(
			this,
			config.width / 2,
			config.height / 5,
			`player_texture_${spriteKey}`,
			gameSettings.playerMaxHealth,
		)

		opponent.play(`player_anim_${spriteKey}`)
		opponent.restartToTile()

		opponent.flipY = true

		opponent.playerId = playerInfo.playerId
		self.players.add(opponent)
		this.initializePVPManager()
	}

	createOpponentBullet(bulletData) {
		opponent.shootBullet(opponentSprite, opponent, 0)
	}

	update() {
		if (player) {
			playerManager.movePlayerPVP(this.socket)

			const x = config.width - player.x
			const y = config.height - player.y // Transform the y-coordinate

			if (
				player.oldPosition &&
				(x !== player.oldPosition.x || y !== player.oldPosition.y)
			) {
				this.socket.emit('playerMovement', { x, y })
			}

			if (!player.oldPosition) {
				player.oldPosition = {}
			}

			player.oldPosition.x = x
			player.oldPosition.y = y
		}

		this.background.tilePositionY -= BACKGROUND_SCROLL_SPEED

		if (this.spacebar.isDown) {
			player.shootBullet(mainSprite, player, 1)

			this.socket.emit('shootBullet', {
				x: config.width - player.x,
				y: config.height - (player.y - 10),
				anims: `bullet${mainSprite}_anim`,
				// Add any other relevant bullet information
			})
		}

		this.pvpProjectiles1.children.iterate((bullet) => {
			bullet.update()
		})

		this.pvpProjectiles2.children.iterate((bullet) => {
			bullet.update()
		})

		if (player && player.health <= 0) {
			this.gameOver()
		}

		if (opponent && opponent.health <= 0) {
			this.gameOver()
		}
	}

	initializePVPManager() {
		if (player && opponent) {
			// Step 3: Check if both player and opponent are defined
			this.collidePVPManager = new PVPManager(this, player, opponent)
		}
	}

	gameOver() {
		this.scene.stop()
		this.scene.start('bootGame', { key: this.callingScene })
	}
}

export default PVPScreen
