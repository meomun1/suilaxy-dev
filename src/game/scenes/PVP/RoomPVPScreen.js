import Phaser from 'phaser'
import config from '../../config/config.js'
import Button from '../../objects/Button.js'
import Music from '../../mode/Music.js'
import GuiManager from '../../manager/GuiManager.js'
import { EventBus } from '../../EventBus.js'
import socket from '../../objects/Socket.js'

class RoomPVPScreen extends Phaser.Scene {
	constructor() {
		super('roomScreen')
		this.music = null
		this.bgMusic = null
		this.guiManager = new GuiManager(this)
		this.selectedPlayerIndex1 = 1
		this.selectedPlayerIndex2 = 2
		this.statePlayer = false
		this.stateOpponent = false
	}

	init(data) {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
		this.roomNumber = data.room
		this.playerPosition = data.number
	}

	preload() {
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')

		this.guiManager.loadImage(
			'background',
			'assets/images/backgrounds/background_title.png',
		)

		// Correctly loading spritesheets
		this.load.spritesheet(
			'player_texture_1',
			'assets/spritesheets/players/planes_01A.png',
			{
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		)

		this.load.spritesheet(
			'player_texture_2',
			'assets/spritesheets/players/planes_02A.png',
			{
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 19,
			},
		)

		this.load.image('avatar1', 'assets/images/avatar/female-01.png')
		this.load.image('avatar2', 'assets/images/avatar/female-02.png')
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		this.socket = socket

		this.createUI()

		this.socketListeners()
	}

	createUI() {
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

		this.guiManager.createBackground('background')

		this.guiManager.createAnimatedTextSizeColor(
			'DEFEAT YOUR ENEMY',
			-250,
			60,
			'#F27CA4',
		)

		this.guiManager.createAnimatedTextSizeColor('PVP MODE', -350, 80, '#F27CA4')
		this.guiManager.createAnimatedTextSizeColor(
			'------------VS------------',
			100,
			70,
			'#F27CA4',
		)

		this.guiManager.createAnimatedTextSizeColor(
			`ROOM ${this.roomNumber}`,
			450,
			60,
			'#F27CA4',
		)
	}

	socketListeners() {
		if (this.playerPosition) {
			this.socket.emit('playerLoadInRoom', { roomNumber: this.roomNumber })
		}

		this.socket.on('roomState', (data) => {
			Object.values(data).forEach((player) => {
				this.loadPlayers(player.playerNumber, player.playerId)
			})
		})

		this.socket.on('opponentLoadInRoom', (data) => {
			this.loadPlayers(data.playerNumber, data.playerId)
		})
	}

	loadPlayers(playerNumber, playerId) {
		if (playerNumber === 1) {
			this.guiManager.createSimpleText(
				(config.width * 3) / 4,
				310,
				`${playerId}`,
				40,
				'#FFFFFF',
				0.5,
			)

			this.sprite1 = this.add.sprite(
				config.width / 4,
				430,
				'player_texture_1',
				0,
			)
			this.sprite1.displayWidth = 250 // Set the desired width
			this.sprite1.displayHeight = 250 // Set the desired height
			this.sprite1.angle = 135

			this.avatar1 = this.add.image((config.width * 3) / 4, 400, 'avatar1')

			this.statePlayer = true
		}

		if (playerNumber === 2) {
			this.guiManager.createSimpleText(
				config.width / 4,
				(config.height * 3) / 4 + 120,
				`${playerId}`,
				40,
				'#FFFFFF',
				0.5,
			)

			// Correctly adding sprites to the scene
			// Correctly adding sprites to the scene and resizing them

			this.sprite2 = this.add.sprite(
				(config.width * 3) / 4,
				(config.height * 3) / 4,
				'player_texture_2',
				0,
			)
			this.sprite2.displayWidth = 250 // Set the desired width
			this.sprite2.displayHeight = 250 // Set the desired height
			this.sprite2.angle = 315

			this.avatar2 = this.add.image(
				config.width / 4,
				(config.height * 3) / 4,
				'avatar2',
			)

			this.stateOpponent = true
		}
	}

	update() {
		if (this.statePlayer && this.stateOpponent) {
			setTimeout(() => {
				this.scene.start('pvpScreen', {
					room: this.roomNumber,
					playerPosition: this.playerPosition,
				})
			}, 3000)

			this.statePlayer = false
			this.stateOpponent = false
		}
	}
}

export default RoomPVPScreen
