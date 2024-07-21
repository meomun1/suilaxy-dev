import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import socket from '../objects/Socket.js'

let PORT =
	'http://localhost:3000/' || 'https://render-socket-t2rl7mbmfa-as.a.run.app/'

let input
let playerPosition

class ChooseRoomScreen extends Phaser.Scene {
	constructor() {
		super('chooseRoom')
		this.music = null
		this.bgMusic = null
		this.guiManager = new GuiManager(this)
		this.selectedPlayerIndex1 = null
		this.selectedPlayerIndex2 = null
	}

	init(data) {
		const music = new Music()
		this.sys.game.globals = { music, bgMusic: null }
		this.selectedPlayerIndex = data.number
	}

	preload() {
		this.load.html('nameform', 'public/assets/text/nameForm.html')

		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')

		this.guiManager.loadImage(
			'background',
			'assets/images/backgrounds/background_title.png',
		)
	}

	create() {
		this.socket = socket

		this.socket.on('connect_error', (err) => {
			// the reason of the error, for example "xhr poll error"
			console.log(err.message)

			// some additional description, for example the status code of the initial HTTP response
			console.log(err.description)

			// some additional context, for example the XMLHttpRequest object
			console.log(err.context)
		})

		this.createLobbyUI()
		this.setupSocketListeners()
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

		this.guiManager.createBackground('background')

		this.createBlackCover()

		this.guiManager.createSimpleText(
			config.width / 2,
			config.height / 5,
			'Enter the room number',
			50,
			'#FFFFFF',
			0.5,
		)

		this.createInputText()
	}

	createInputText() {
		const element = this.add
			.dom(config.width / 2, (config.height * 2) / 5)
			.createFromCache('nameform')

		let isClicked = false

		element.addListener('click')

		element.on('click', (event) => {
			if (!isClicked && event.target.name === 'playButton') {
				isClicked = true

				const inputText = document.querySelector('input[name="nameField"]')

				if (inputText && inputText.value !== '') {
					input = inputText.value
					this.socket.emit('joinRoom', { room: inputText.value })
				}

				// Reset isClicked after 1 second
				setTimeout(() => {
					isClicked = false
				}, 1000)
			}
		})
	}

	setupSocketListeners() {
		this.socket.emit('getRooms')

		this.socket.on('rooms', (rooms) => {
			this.listOfRooms(rooms)
		})

		this.socket.on('joinedRoom', (room) => {
			this.goToRoom(room)
		})

		this.socket.on('roomFull', () => {
			this.roomFull()
		})
	}

	listOfRooms(rooms) {
		let y = 0
		let x = 0

		Object.keys(rooms).forEach((roomNumber) => {
			const room = rooms[roomNumber]
			this.guiManager.createSimpleText(
				config.width / 2,
				config.height / 2 + y,
				`Room : ${roomNumber} - ${room.playerCount} / 2 players`,
				30,
				'#FFFFFF',
				0.5,
			)
			y += 50
		})

		let roomKeys = Object.keys(rooms)
		console.log(roomKeys)
	}

	goToRoom(room) {
		this.guiManager.createSimpleText(
			config.width / 2,
			(config.height * 2) / 5 - 50,
			'Your room is ready',
			50,
			'#FFFFFF',
			0.5,
		)

		console.log(this.socket.id)
		// Set a timeout for 2 seconds (2000 milliseconds) before starting the scene
		setTimeout(() => {
			this.scene.start('roomScreen', {
				room: input,
				number: room.playerInfo.playerNumber,
			})
		}, 2000)
	}

	roomFull() {
		this.guiManager.createDelayDeleteSimpleText(
			config.width / 2,
			(config.height * 2) / 5 - 50,
			'This room is full',
			50,
			'#FFFFFF',
			0.5,
			2000,
		)
	}
}
export default ChooseRoomScreen
