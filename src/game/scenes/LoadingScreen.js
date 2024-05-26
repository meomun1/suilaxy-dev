import Phaser from 'phaser'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
class LoadingScreen extends Phaser.Scene {
	constructor() {
		super('loadingScreen')

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

		// Load boss spritesheets
		this.load.spritesheet({
			key: 'boss_texture',
			url: 'assets/spritesheets/enemies/boss-01.png',
			frameConfig: {
				frameWidth: 240,
				frameHeight: 240,
				startFrame: 0,
				endFrame: 7,
			},
		})

		this.load.spritesheet({
			key: 'mini_texture',
			url: 'assets/spritesheets/enemies/support-bot.png',
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load Enemy Spritesheets
		this.load.spritesheet({
			key: 'bug1_texture',
			url: 'assets/spritesheets/enemies/bug_1.png',
			frameConfig: {
				frameWidth: 64,
				frameHeight: 64,
				startFrame: 0,
				endFrame: 5,
			},
		})

		this.load.spritesheet({
			key: 'bug3_texture',
			url: 'assets/spritesheets/enemies/bug_3.png',
			frameConfig: {
				frameWidth: 64,
				frameHeight: 64,
				startFrame: 0,
				endFrame: 5,
			},
		})

		this.load.spritesheet({
			key: 'bug5_texture',
			url: 'assets/spritesheets/enemies/bug_5.png',
			frameConfig: {
				frameWidth: 64,
				frameHeight: 64,
				startFrame: 0,
				endFrame: 5,
			},
		})

		// Load health pack Spritesheet
		this.load.spritesheet({
			key: 'healthPack_texture',
			url: 'assets/spritesheets/vfx/healthPack.png',
			frameConfig: {
				frameWidth: 32,
				frameHeight: 32,
				startFrame: 0,
				endFrame: 4,
			},
		})

		// Load the HealthBar
		this.load.spritesheet({
			key: 'healthBar_texture',
			url: 'assets/spritesheets/vfx/healthBar_01.png',
			frameConfig: {
				frameWidth: 331,
				frameHeight: 154,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load the Pause display button
		this.load.spritesheet({
			key: 'pauseDis_texture',
			url: 'assets/spritesheets/vfx/pauseDis.png',
			frameConfig: {
				frameWidth: 36,
				frameHeight: 36,
				startFrame: 0,
				endFrame: 1,
			},
		})

		// Load the setting button
		this.load.spritesheet({
			key: 'settingButton_texture',
			url: 'assets/spritesheets/vfx/settingButton.png',
			frameConfig: {
				frameWidth: 36,
				frameHeight: 36,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load the setting hover button
		this.load.spritesheet({
			key: 'mute_texture',
			url: 'assets/spritesheets/vfx/mute.png',
			frameConfig: {
				frameWidth: 36,
				frameHeight: 36,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load the setting button
		this.load.spritesheet({
			key: 'sound_texture',
			url: 'assets/spritesheets/vfx/sound.png',
			frameConfig: {
				frameWidth: 36,
				frameHeight: 36,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load the setting hover button
		this.load.spritesheet({
			key: 'settingHover_texture',
			url: 'assets/spritesheets/vfx/settingHover.png',
			frameConfig: {
				frameWidth: 36,
				frameHeight: 36,
				startFrame: 0,
				endFrame: 0,
			},
		})

		// Load shield pack Spritesheet
		this.load.spritesheet({
			key: 'shieldPack_texture',
			url: 'assets/spritesheets/vfx/shieldPack.png',
			frameConfig: {
				frameWidth: 32,
				frameHeight: 32,
				startFrame: 0,
				endFrame: 4,
			},
		})

		// Load shield Spritesheet
		this.load.spritesheet({
			key: 'shield_texture',
			url: 'assets/spritesheets/vfx/shield.png',
			frameConfig: {
				frameWidth: 96,
				frameHeight: 96,
				startFrame: 0,
				endFrame: 5,
			},
		})

		// Load chase bullet Spritesheet
		this.load.spritesheet({
			key: `bulletChase_texture`,
			url: `assets/spritesheets/vfx/chaseBullet_01.png`,
			frameConfig: {
				frameWidth: 24,
				frameHeight: 24,
				startFrame: 0,
				endFrame: 5,
			},
		})

		// Load Bullet Spritesheet
		if (this.selectedPlayerIndex == 1) {
			this.load.spritesheet({
				key: `bullet1_texture`,
				url: `assets/spritesheets/vfx/bullet1.png`,
				frameConfig: {
					frameWidth: 32,
					frameHeight: 11,
					startFrame: 0,
					endFrame: 1,
				},
			})
		}

		if (this.selectedPlayerIndex == 2) {
			this.load.spritesheet({
				key: `bullet2_texture`,
				url: `assets/spritesheets/vfx/bullet2.png`,
				frameConfig: {
					frameWidth: 25,
					frameHeight: 33,
					startFrame: 0,
					endFrame: 5,
				},
			})
		}

		if (this.selectedPlayerIndex == 3) {
			this.load.spritesheet({
				key: `bullet3_texture`,
				url: `assets/spritesheets/vfx/bullet3.png`,
				frameConfig: {
					frameWidth: 20,
					frameHeight: 32,
					startFrame: 0,
					endFrame: 4,
				},
			})
		}

		if (this.selectedPlayerIndex == 4) {
			this.load.spritesheet({
				key: `bullet${this.selectedPlayerIndex}_texture`,
				url: `assets/spritesheets/vfx/bullet4.png`,
				frameConfig: {
					frameWidth: 22,
					frameHeight: 22,
					startFrame: 0,
					endFrame: 5,
				},
			})
		}

		if (this.selectedPlayerIndex == 5) {
			this.load.spritesheet({
				key: `bullet5_texture`,
				url: `assets/spritesheets/vfx/bullet5.png`,
				frameConfig: {
					frameWidth: 20,
					frameHeight: 39,
					startFrame: 0,
					endFrame: 3,
				},
			})
		}

		if (this.selectedPlayerIndex == 6) {
			this.load.spritesheet({
				key: `bullet6_texture`,
				url: `assets/spritesheets/vfx/bullet6.png`,
				frameConfig: {
					frameWidth: 15,
					frameHeight: 25,
					startFrame: 0,
					endFrame: 2,
				},
			})
		}

		if (this.selectedPlayerIndex == 7) {
			this.load.spritesheet({
				key: `bullet7_texture`,
				url: `assets/spritesheets/vfx/bullet7.png`,
				frameConfig: {
					frameWidth: 20,
					frameHeight: 30,
					startFrame: 0,
					endFrame: 3,
				},
			})
		}

		if (this.selectedPlayerIndex == 8) {
			this.load.spritesheet({
				key: `bullet8_texture`,
				url: `assets/spritesheets/vfx/bullet8.png`,
				frameConfig: {
					frameWidth: 30,
					frameHeight: 30,
					startFrame: 0,
					endFrame: 5,
				},
			})
		}

		if (this.selectedPlayerIndex == 9) {
			this.load.spritesheet({
				key: `bullet9_texture`,
				url: `assets/spritesheets/vfx/bullet9.png`,
				frameConfig: {
					frameWidth: 20,
					frameHeight: 30,
					startFrame: 0,
					endFrame: 3,
				},
			})
		}

		// Load enemy Bullet Spritesheet
		this.load.spritesheet({
			key: 'bullet_texture',
			url: 'assets/spritesheets/vfx/bullet.png',
			frameConfig: {
				frameWidth: 12,
				frameHeight: 26,
				startFrame: 0,
				endFrame: 2,
			},
		})

		// Load Effect Spritesheets
		this.load.spritesheet({
			key: 'explosion_texture',
			url: 'assets/spritesheets/vfx/explosion.png',
			frameConfig: {
				frameWidth: 100,
				frameHeight: 100,
				startFrame: 0,
				endFrame: 11,
			},
		})
		this.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
		this.load.audio('shootSound', 'assets/audio/bullet.wav')
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')
		this.load.audio('health', 'assets/audio/health.wav')
		this.load.audio('shield', 'assets/audio/shield.wav')
		this.load.audio('bossMusic', 'assets/audio/boss.mp3')
	}

	create() {
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

export default LoadingScreen
