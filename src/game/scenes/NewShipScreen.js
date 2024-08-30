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

class NewShipScreen extends Phaser.Scene {
	constructor() {
		super('NewShipScreen')
	}

	init(data) {
		this.selectedPlayerIndex = data.number
	}

	preload() {
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

		this.load.image('background', 'assets/backgrounds/background.png')
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		this.cameras.main.fadeIn(1000, 0, 0, 0)

		this.guiManager = new GuiManager(this)
		this.guiManager.createBackground('background_texture_02')

		// Print out "The reinforcement is here!"
		const reinforcementText = this.add.text(
			config.width / 2,
			config.height / 2 - 60,
			'The reinforcement is here!',
			{ fontFamily: 'Pixelify Sans', fontSize: '32px', fill: '#FFFB73' },
		)
		reinforcementText.setOrigin(0.5)

		// Go to level 3 scene
		this.time.delayedCall(
			2000,
			() => {
				this.scene.start('bossGame', {
					number: this.selectedPlayerIndex,
				})
			},
			[],
			this,
		)
	}
}

export default NewShipScreen
