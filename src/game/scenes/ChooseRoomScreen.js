import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import io from 'socket.io-client'

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
	}

	create() {
		this.setupSocketListeners()
		this.createLobbyUI()
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
	}

	setupSocketListeners() {}
}

export default ChooseRoomScreen
