import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import io from 'socket.io-client'
import Player from '../objects/players/Player'
import gameSettings from '../config/gameSettings.js'
import PlayerManager from '../manager/PlayerManager.js'

let cursors
let playerManager1
let playerManager2

class PVPScreen extends Phaser.Scene {
	constructor() {
		super('pvpScreen')
		this.music = null
		this.bgMusic = null
		this.guiManager = new GuiManager(this)
		this.selectedPlayerIndex1 = 1
		this.selectedPlayerIndex2 = 2
		this.players = []
		this.inforPlayer = []
	}

	init(data) {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
		this.selectedPlayerIndex = data.number
	}

	preload() {
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

		this.createPlayer(this.selectedPlayerIndex1)
		this.createPlayer(this.selectedPlayerIndex2)

		this.players = this.add.group()

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
		if (this.music.musicOn === true) {
			this.bgMusic = this.sound.add('main_menu_music', {
				volume: 0.5,
				loop: true,
			})
			this.bgMusic.play()
			this.music.bgMusicPlaying = true
			this.sys.game.globals.bgMusic = this.bgMusic
		}
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
					this.inforPlayer.push(players[id])
				} else {
					this.addOtherPlayers(this, players[id])
					this.inforPlayer.push(players[id])
				}
			})
		})

		this.socket.on('newPlayer', (playerInfo) => {
			this.addOtherPlayers(this, playerInfo)
			this.inforPlayer.push(playerInfo)
		})

		this.socket.on('playerDisconnected', (playerId) => {
			this.players.getChildren().forEach((player) => {
				if (playerId === player.playerId) {
					player.destroy()
				}
			})
		})

		this.socket.on('playerMoved', (playerInfo) => {
			this.players.getChildren().forEach((player) => {
				if (playerInfo.playerId === player.playerId) {
					player.setPosition(playerInfo.x, playerInfo.y)
				}
			})
		})

		this.socket.on('gameFull', () => {
			alert('Game is full')
		})

		cursors = this.input.keyboard.createCursorKeys()
	}

	addPlayer(self, playerInfo) {
		let spriteKey

		if (playerInfo.playerNumber === 1) {
			spriteKey = this.selectedPlayerIndex1
		} else {
			spriteKey = this.selectedPlayerIndex2
		}

		let player = new Player(
			this,
			playerInfo.x,
			playerInfo.y,
			`player_texture_${spriteKey}`,
			gameSettings.playerMaxHealth,
		)

		player.play(`player_anim_${spriteKey}`)
		player.restartToTile()
		player.playerId = playerInfo.playerId
		self.players.add(player)

		if (playerInfo.playerNumber === 1) {
			playerManager1 = new PlayerManager(this, player)
		} else {
			playerManager2 = new PlayerManager(this, player)
		}
	}

	addOtherPlayers(self, playerInfo) {
		let spriteKey

		if (playerInfo.playerNumber === 1) {
			spriteKey = this.selectedPlayerIndex1
		} else {
			spriteKey = this.selectedPlayerIndex2
		}

		let opponent = new Player(
			this,
			playerInfo.x,
			playerInfo.y,
			`player_texture_${spriteKey}`,
			gameSettings.playerMaxHealth,
		)

		opponent.play(`player_anim_${spriteKey}`)
		opponent.restartToTile()
		opponent.playerId = playerInfo.playerId
		self.players.add(opponent)

		if (playerInfo.playerNumber === 1) {
			playerManager1 = new PlayerManager(this, opponent)
		} else {
			playerManager2 = new PlayerManager(this, opponent)
		}
	}

	update() {
		// console.log(this.inforPlayer)
		// console.log(this.socket.id)
		// const playerInfor = this.inforPlayer.find(
		// 	(player) => player.playerId === this.socket.id,
		// )
		// console.log(playerInfor)
		// if (playerInfor.playerNumber === 1) {
		// 	playerManager1.movePlayer()
		// } else {
		// 	playerManager2.movePlayer()
		// }
		// playerManager1.movePlayer()
		// playerManager2.movePlayer()
	}
}

export default PVPScreen
