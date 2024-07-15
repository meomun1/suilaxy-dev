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
let opponentManager
let player
let opponent
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
	}

	create() {
		this.socket = io('http://localhost:3000')

		// Create player animations
		this.createPlayer(this.selectedPlayerIndex1)
		this.createPlayer(this.selectedPlayerIndex2)

		this.players = this.add.group()

		this.SoundManager = new SoundManager(this)
		this.keyboardManager = new KeyboardManager(this, this.music)
		this.projectileManager = new ProjectileManager(this)
		this.projectileManager.createPlayerBullet()
		this.projectileManager.createPlayerBullet2()

		this.spacebar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		)
		this.enter = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER,
		)

		this.createLobbyUI()
		this.setupSocketListeners()
	}

	createPlayer(selectedPlayerIndex) {
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
			console.log('playerAnimation', data.animationKey)
			opponent.play(data.animationKey)
		})

		this.socket.on('gameFull', () => {
			alert('Game is full')
		})
	}

	addPlayer(self, playerInfo) {
		let spriteKey

		if (playerInfo.playerNumber === 1) {
			spriteKey = this.selectedPlayerIndex1
		} else {
			spriteKey = this.selectedPlayerIndex2
		}

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

		// if (this.spacebar.isDown) {
		// 	player.shootBullet(this.selectedPlayerIndex1)
		// }

		// this.projectiles.children.iterate((bullet) => {
		// 	bullet.update()
		// })
	}

	initializePVPManager() {
		if (player && opponent) {
			// Step 3: Check if both player and opponent are defined
			this.collidePVPManager = new PVPManager(this, player, opponent)
		}
	}
}

export default PVPScreen
