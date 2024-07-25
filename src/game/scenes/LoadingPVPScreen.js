import Phaser from 'phaser'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
class LoadingPvPScreen extends Phaser.Scene {
	constructor() {
		super('loadingPvPScreen')

		this.guiManager = new GuiManager(this)
	}

	init(data) {
		this.selectedPlayerIndex = data.number
	}

	preload() {
		// Load background
		this.load.image(
			'background_texture',
			'assets/images/backgrounds/purple/nebula_1.png',
		)

		this.load.image(
			'background_texture_01',
			'assets/images/backgrounds/green/nebula_6.png',
		)

		this.load.image(
			'background_texture_02',
			'assets/images/backgrounds/blue/nebula_2.png',
		)

		this.load.image(
			'background_texture_03',
			'assets/images/backgrounds/purple/nebula_3.png',
		)

		this.load.image(
			'background_texture_04',
			'assets/images/backgrounds/blue/redbula_1.png',
		)

		// Load health pack Spritesheet

		this.guiManager.loadSpriteSheet(
			'healthPack_texture',
			'assets/spritesheets/vfx/healthPack.png',
			32,
			32,
			0,
			4,
		)

		// Load the HealthBar

		this.guiManager.loadSpriteSheet(
			'healthBar_texture',
			'assets/spritesheets/vfx/healthBar_01.png',
			331,
			154,
			0,
			0,
		)

		// Load the Pause display button
		this.guiManager.loadSpriteSheet(
			'pauseDis_texture',
			'assets/spritesheets/vfx/pauseDis.png',
			36,
			36,
			0,
			1,
		)

		// Load the setting button
		this.guiManager.loadSpriteSheet(
			'settingButton_texture',
			'assets/spritesheets/vfx/settingButton.png',
			36,
			36,
			0,
			0,
		)

		// Load the setting hover button
		this.guiManager.loadSpriteSheet(
			'mute_texture',
			'assets/spritesheets/vfx/mute.png',
			36,
			36,
			0,
			0,
		)

		// Load the setting button
		this.guiManager.loadSpriteSheet(
			'sound_texture',
			'assets/spritesheets/vfx/sound.png',
			36,
			36,
			0,
			0,
		)

		// Load the setting hover button
		this.guiManager.loadSpriteSheet(
			'settingHover_texture',
			'assets/spritesheets/vfx/settingHover.png',
			36,
			36,
			0,
			0,
		)

		// Load shield pack Spritesheet
		this.guiManager.loadSpriteSheet(
			'shieldPack_texture',
			'assets/spritesheets/vfx/shieldPack.png',
			32,
			32,
			0,
			4,
		)

		// Load shield Spritesheet
		this.guiManager.loadSpriteSheet(
			'shield_texture',
			'assets/spritesheets/vfx/shield.png',
			96,
			96,
			0,
			5,
		)

		// Load chase bullet Spritesheet
		this.guiManager.loadSpriteSheet(
			'bulletChase_texture',
			'assets/spritesheets/vfx/chaseBullet_01.png',
			24,
			24,
			0,
			5,
		)

		if (this.selectedPlayerIndex == 1) {
			this.guiManager.loadSpriteSheet(
				'bullet1_texture',
				'assets/spritesheets/vfx/bullet1.png',
				32,
				11,
				0,
				1,
			)
		}

		if (this.selectedPlayerIndex == 2) {
			this.guiManager.loadSpriteSheet(
				'bullet2_texture',
				'assets/spritesheets/vfx/bullet2.png',
				25,
				33,
				0,
				5,
			)
		}

		if (this.selectedPlayerIndex == 3) {
			this.guiManager.loadSpriteSheet(
				'bullet3_texture',
				'assets/spritesheets/vfx/bullet3.png',
				20,
				32,
				0,
				4,
			)
		}

		if (this.selectedPlayerIndex == 4) {
			this.guiManager.loadSpriteSheet(
				`bullet${this.selectedPlayerIndex}_texture`,
				`assets/spritesheets/vfx/bullet4.png`,
				22,
				22,
				0,
				5,
			)
		}

		if (this.selectedPlayerIndex == 5) {
			this.guiManager.loadSpriteSheet(
				'bullet5_texture',
				'assets/spritesheets/vfx/bullet5.png',
				20,
				39,
				0,
				3,
			)
		}

		if (this.selectedPlayerIndex == 6) {
			this.guiManager.loadSpriteSheet(
				'bullet6_texture',
				'assets/spritesheets/vfx/bullet6.png',
				15,
				25,
				0,
				2,
			)
		}

		if (this.selectedPlayerIndex == 7) {
			this.guiManager.loadSpriteSheet(
				'bullet7_texture',
				'assets/spritesheets/vfx/bullet7.png',
				20,
				30,
				0,
				3,
			)
		}

		if (this.selectedPlayerIndex == 8) {
			this.guiManager.loadSpriteSheet(
				'bullet8_texture',
				'assets/spritesheets/vfx/bullet8.png',
				30,
				30,
				0,
				5,
			)
		}

		if (this.selectedPlayerIndex == 9) {
			this.guiManager.loadSpriteSheet(
				'bullet9_texture',
				'assets/spritesheets/vfx/bullet9.png',
				20,
				30,
				0,
				3,
			)
		}

		// Load enemy Bullet Spritesheet
		this.guiManager.loadSpriteSheet(
			'bullet_texture',
			'assets/spritesheets/vfx/bullet.png',
			12,
			26,
			0,
			2,
		)

		// Load Effect Spritesheets
		this.guiManager.loadSpriteSheet(
			'explosion_texture',
			'assets/spritesheets/vfx/explosion.png',
			100,
			100,
			0,
			11,
		)

		this.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
		this.load.audio('shootSound', 'assets/audio/bullet.wav')
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')
		this.load.audio('health', 'assets/audio/health.wav')
		this.load.audio('shield', 'assets/audio/shield.wav')
		this.load.audio('bossMusic', 'assets/audio/boss.mp3')
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)
		this.cameras.main.fadeIn(500, 0, 0, 0)

		// Create first bullet animations
		if (this.selectedPlayerIndex == 1) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 1,
					},
				),
				frameRate: 12,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 2) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 5,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 3) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 4,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 4) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 5,
					},
				),
				frameRate: 20,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 5) {
			this.anims.create({
				key: `bullet5_anim`,
				frames: this.anims.generateFrameNumbers(`bullet5_texture`, {
					start: 0,
					end: 3,
				}),
				frameRate: 30,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 6) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 2,
					},
				),
				frameRate: 12,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 7) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 3,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 8) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 5,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}

		if (this.selectedPlayerIndex == 9) {
			this.anims.create({
				key: `bullet${this.selectedPlayerIndex}_anim`,
				frames: this.anims.generateFrameNumbers(
					`bullet${this.selectedPlayerIndex}_texture`,
					{
						start: 0,
						end: 3,
					},
				),
				frameRate: 30,
				repeat: -1,
			})
		}

		// Create player animations
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

		// Create bullet animations
		this.anims.create({
			key: 'bulletChase_anim',
			frames: this.anims.generateFrameNumbers('bulletChase_texture', {
				start: 0,
				end: 5,
			}),
			frameRate: 15,
			repeat: -1,
		})

		// Create boss animations

		this.anims.create({
			key: 'boss_move_anim',
			frames: this.anims.generateFrameNumbers('boss_texture', {
				start: 0,
				end: 3,
			}),
			frameRate: 20,
			repeat: -1,
		})

		this.anims.create({
			key: 'boss_shoot_anim',
			frames: this.anims.generateFrameNumbers('boss_texture', {
				start: 0,
				end: 7,
			}),
			frameRate: 20,
			repeat: -1,
		})

		// Create enemy animations
		this.anims.create({
			key: 'bug1_anim',
			frames: this.anims.generateFrameNumbers('bug1_texture', {
				start: 0,
				end: 5,
			}),
			frameRate: 20,
			repeat: -1,
		})

		this.anims.create({
			key: 'bug3_anim',
			frames: this.anims.generateFrameNumbers('bug3_texture', {
				start: 0,
				end: 5,
			}),
			frameRate: 20,
			repeat: -1,
		})

		this.anims.create({
			key: 'bug5_anim',
			frames: this.anims.generateFrameNumbers('bug5_texture', {
				start: 0,
				end: 5,
			}),
			frameRate: 20,
			repeat: -1,
		})

		// Create health pack animations
		this.anims.create({
			key: 'healthPack_anim',
			frames: this.anims.generateFrameNumbers('healthPack_texture', {
				start: 0,
				end: 4,
			}),
			frameRate: 20,
			repeat: -1,
		})

		// Create shield pack animations
		this.anims.create({
			key: 'shieldPack_anim',
			frames: this.anims.generateFrameNumbers('shieldPack_texture', {
				start: 0,
				end: 4,
			}),
			frameRate: 20,
			repeat: -1,
		})

		// Create shield animations
		this.anims.create({
			key: 'shield_anim',
			frames: this.anims.generateFrameNumbers('shield_texture', {
				start: 0,
				end: 5,
			}),
			frameRate: 20,
			repeat: -1,
		})

		// Create explosion animations
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

		// Create pause display animations
		this.anims.create({
			key: 'pauseDis_anim',
			frames: this.anims.generateFrameNumbers('pauseDis_texture', {
				start: 0,
				end: 1,
			}),
			frameRate: 60,
			repeat: 0,
			hideOnComplete: true,
		})

		// Create loading text
		const loadingText = this.add.text(
			config.width / 2,
			config.height / 2 - 60,
			'LOADING',
			{ fontFamily: 'Pixelify Sans', fontSize: '50px', fill: '#fff' },
		)
		loadingText.setOrigin(0.5)

		this.time.delayedCall(1000, () => {
			let value = this.selectedPlayerIndex
			this.scene.start('playTutorial', { number: value })
		})
	}
}

export default LoadingPvPScreen
