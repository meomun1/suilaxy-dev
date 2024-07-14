import Phaser from 'phaser'
import config from '../config/config.js'
import Button from '../objects/Button.js'
import Music from '../mode/Music.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import io from 'socket.io-client'

class RoomPVPScreen extends Phaser.Scene {
	constructor() {
		super('roomScreen')
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

		this.guiManager.createAnimatedTextSizeColor('ROOM 123', 450, 60, '#F27CA4')

		this.guiManager.createSimpleText(
			(config.width * 3) / 4,
			310,
			'MAX LUONG',
			40,
			'#FFFFFF',
			0.5,
		)
		this.guiManager.createSimpleText(
			config.width / 4,
			(config.height * 3) / 4 + 120,
			'MAX LUONG',
			40,
			'#FFFFFF',
			0.5,
		)

		// Correctly adding sprites to the scene
		// Correctly adding sprites to the scene and resizing them
		let sprite1 = this.add.sprite(config.width / 4, 430, 'player_texture_1', 0)
		sprite1.displayWidth = 250 // Set the desired width
		sprite1.displayHeight = 250 // Set the desired height
		sprite1.angle = 135

		let sprite2 = this.add.sprite(
			(config.width * 3) / 4,
			(config.height * 3) / 4,
			'player_texture_2',
			0,
		)
		sprite2.displayWidth = 250 // Set the desired width
		sprite2.displayHeight = 250 // Set the desired height
		sprite2.angle = 315

		let avatar1 = this.add.image((config.width * 3) / 4, 400, 'avatar1')
		let avatar2 = this.add.image(
			config.width / 4,
			(config.height * 3) / 4,
			'avatar2',
		)
	}
}

export default RoomPVPScreen
