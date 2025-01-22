import Phaser from 'phaser'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
class LoadingScreen extends Phaser.Scene {
	constructor() {
		super('loadingScreen')

		this.guiManager = new GuiManager(this)
	}

	init() {
		this.selectedPlayerIndex = gameSettings.selectedPlayerIndex
	}

	preload() {
		// Load background
		// Helper function to load image if it doesn't exist
		const loadImageIfNotExists = (key, path) => {
			if (!this.textures.exists(key)) {
				this.load.image(key, path)
			}
		}

		// Usage of the helper function
		loadImageIfNotExists.call(
			this,
			'background_texture',
			'assets/images/backgrounds/purple/nebula_1.png',
		)
		loadImageIfNotExists.call(
			this,
			'background_texture_01',
			'assets/images/backgrounds/green/nebula_6.png',
		)
		loadImageIfNotExists.call(
			this,
			'background_texture_02',
			'assets/images/backgrounds/blue/nebula_2.png',
		)
		loadImageIfNotExists.call(
			this,
			'background_texture_03',
			'assets/images/backgrounds/purple/nebula_3.png',
		)
		loadImageIfNotExists.call(
			this,
			'background_texture_04',
			'assets/images/backgrounds/blue/redbula_1.png',
		)

		// Load boss spritesheets

		// Helper function to load spritesheet if it doesn't exist
		const loadSpriteSheetIfNotExists = (
			key,
			path,
			frameWidth,
			frameHeight,
			margin,
			spacing,
		) => {
			if (!this.textures.exists(key)) {
				this.guiManager.loadSpriteSheet(
					key,
					path,
					frameWidth,
					frameHeight,
					margin,
					spacing,
				)
			}
		}

		// Usage of the helper functions
		loadSpriteSheetIfNotExists.call(
			this,
			'boss_texture',
			'assets/spritesheets/enemies/boss-01.png',
			240,
			240,
			0,
			7,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'mini_texture',
			'assets/spritesheets/enemies/support-bot.png',
			96,
			96,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'bug1_texture',
			'assets/spritesheets/enemies/bug_1.png',
			64,
			64,
			0,
			5,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'bug3_texture',
			'assets/spritesheets/enemies/bug_3.png',
			64,
			64,
			0,
			5,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'bug5_texture',
			'assets/spritesheets/enemies/bug_5.png',
			64,
			64,
			0,
			5,
		)

		loadSpriteSheetIfNotExists.call(
			this,
			'healthPack_texture',
			'assets/spritesheets/vfx/healthPack.png',
			32,
			32,
			0,
			4,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'healthBar_texture',
			'assets/spritesheets/vfx/healthbar-scaled.png',
			218,
			44,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'pauseDis_texture',
			'assets/spritesheets/vfx/pauseDis.png',
			36,
			36,
			0,
			1,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'settingButton_texture',
			'assets/spritesheets/vfx/settingButton.png',
			36,
			36,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'mute_texture',
			'assets/spritesheets/vfx/mute.png',
			36,
			36,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'sound_texture',
			'assets/spritesheets/vfx/sound.png',
			36,
			36,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'settingHover_texture',
			'assets/spritesheets/vfx/settingHover.png',
			36,
			36,
			0,
			0,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'shieldPack_texture',
			'assets/spritesheets/vfx/shieldPack.png',
			32,
			32,
			0,
			4,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'shield_texture',
			'assets/spritesheets/vfx/shield.png',
			96,
			96,
			0,
			5,
		)
		loadSpriteSheetIfNotExists.call(
			this,
			'bulletChase_texture',
			'assets/spritesheets/vfx/chaseBullet_01.png',
			64,
			64,
			0,
			16,
		)
		// Mapping of selectedPlayerIndex to spritesheet details
		const bulletSprites = {
			1: {
				key: 'bullet1_texture',
				path: 'assets/spritesheets/vfx/bullet1.png',
				frameWidth: 32,
				frameHeight: 11,
				margin: 0,
				spacing: 1,
			},
			2: {
				key: 'bullet2_texture',
				path: 'assets/spritesheets/vfx/bullet2.png',
				frameWidth: 25,
				frameHeight: 33,
				margin: 0,
				spacing: 5,
			},
			3: {
				key: 'bullet3_texture',
				path: 'assets/spritesheets/vfx/bullet3.png',
				frameWidth: 20,
				frameHeight: 32,
				margin: 0,
				spacing: 4,
			},
			4: {
				key: `bullet4_texture`,
				path: 'assets/spritesheets/vfx/bullet4.png',
				frameWidth: 22,
				frameHeight: 22,
				margin: 0,
				spacing: 5,
			},
			5: {
				key: 'bullet5_texture',
				path: 'assets/spritesheets/vfx/bullet5.png',
				frameWidth: 20,
				frameHeight: 39,
				margin: 0,
				spacing: 3,
			},
			6: {
				key: 'bullet6_texture',
				path: 'assets/spritesheets/vfx/bullet6.png',
				frameWidth: 15,
				frameHeight: 25,
				margin: 0,
				spacing: 2,
			},
			7: {
				key: 'bullet7_texture',
				path: 'assets/spritesheets/vfx/bullet7.png',
				frameWidth: 20,
				frameHeight: 30,
				margin: 0,
				spacing: 3,
			},
			8: {
				key: 'bullet8_texture',
				path: 'assets/spritesheets/vfx/bullet8.png',
				frameWidth: 30,
				frameHeight: 30,
				margin: 0,
				spacing: 5,
			},
			9: {
				key: 'bullet9_texture',
				path: 'assets/spritesheets/vfx/bullet9.png',
				frameWidth: 20,
				frameHeight: 30,
				margin: 0,
				spacing: 3,
			},
		}

		// Load the appropriate spritesheet based on selectedPlayerIndex
		const bulletSprite = bulletSprites[gameSettings.selectedPlayerIndex]
		if (bulletSprite) {
			loadSpriteSheetIfNotExists.call(
				this,
				bulletSprite.key,
				bulletSprite.path,
				bulletSprite.frameWidth,
				bulletSprite.frameHeight,
				bulletSprite.margin,
				bulletSprite.spacing,
			)
		}

		// Load enemy Bullet Spritesheet
		loadSpriteSheetIfNotExists.call(
			this,
			'bullet_texture',
			'assets/spritesheets/vfx/bullet.png',
			12,
			26,
			0,
			2,
		)

		// Load Effect Spritesheets
		loadSpriteSheetIfNotExists.call(
			this,
			'explosion_texture',
			'assets/spritesheets/vfx/explosion.png',
			100,
			100,
			0,
			11,
		)

		// Bullet Effect Spritesheet

		const effectSprites = {
			1: {
				key: 'effect1_texture',
				path: 'assets/spritesheets/effects/effect_10.png',
				frameWidth: 64,
				frameHeight: 64,
				margin: 0,
				spacing: 59,
			},
			2: {
				key: 'effect2_texture',
				path: 'assets/spritesheets/effects/effect_2.png',
				frameWidth: 64,
				frameHeight: 64,
				margin: 0,
				spacing: 27,
			},
			3: {
				key: 'effect3_texture',
				path: 'assets/spritesheets/effects/effect_3.png',
				frameWidth: 100,
				frameHeight: 100,
				margin: 0,
				spacing: 19,
			},
			4: {
				key: 'effect4_texture',
				path: 'assets/spritesheets/effects/effect_4.png',
				frameWidth: 64,
				frameHeight: 64,
				margin: 0,
				spacing: 12,
			},
			5: {
				key: 'effect5_texture',
				path: 'assets/spritesheets/effects/effect_5.png',
				frameWidth: 72,
				frameHeight: 72,
				margin: 0,
				spacing: 15,
			},
			6: {
				key: 'effect6_texture',
				path: 'assets/spritesheets/effects/effect_6.png',
				frameWidth: 265,
				frameHeight: 265,
				margin: 0,
				spacing: 29,
			},
			7: {
				key: 'effect7_texture',
				path: 'assets/spritesheets/effects/effect_7.png',
				frameWidth: 64,
				frameHeight: 64,
				margin: 0,
				spacing: 65,
			},
			8: {
				key: 'effect8_texture',
				path: 'assets/spritesheets/effects/effect_8.png',
				frameWidth: 413,
				frameHeight: 369,
				margin: 0,
				spacing: 29,
			},
			9: {
				key: 'effect9_texture',
				path: 'assets/spritesheets/effects/effect_9.png',
				frameWidth: 299,
				frameHeight: 313,
				margin: 0,
				spacing: 29,
			},
		}

		const effectSprite = effectSprites[gameSettings.selectedPlayerIndex] // temporary to default effect
		if (effectSprite) {
			loadSpriteSheetIfNotExists.call(
				this,
				effectSprite.key,
				effectSprite.path,
				effectSprite.frameWidth,
				effectSprite.frameHeight,
				effectSprite.margin,
				effectSprite.spacing,
			)
		}

		// enemy effect spritesheet
		loadSpriteSheetIfNotExists.call(
			this,
			'bounce_effect_texture',
			'assets/spritesheets/effects/bounce_effect.png',
			64,
			64,
			0,
			41,
		)

		loadSpriteSheetIfNotExists.call(
			this,
			'electric_effect_texture',
			'assets/spritesheets/effects/electric_effect.png',
			64,
			64,
			0,
			41,
		)

		loadSpriteSheetIfNotExists.call(
			this,
			'time_effect_texture',
			'assets/spritesheets/effects/time_effect.png',
			64,
			64,
			0,
			45,
		)

		loadSpriteSheetIfNotExists.call(
			this,
			'poison_effect_texture',
			'assets/spritesheets/effects/poison_effect.png',
			64,
			64,
			0,
			41,
		)

		this.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
		this.load.audio('shootSound', 'assets/audio/bullet.wav')
		this.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')
		this.load.audio('health', 'assets/audio/health.wav')
		this.load.audio('shield', 'assets/audio/shield.wav')
		this.load.audio('bossMusic', 'assets/audio/boss.mp3')
	}

	create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.cameras.main.fadeIn(500, 0, 0, 0)

		const loadingText = this.add.text(
			config.width / 2,
			config.height / 2 - 60,
			'LOADING : First time may take a while',
			{ fontFamily: 'Pixelify Sans', fontSize: '50px', fill: '#fff' },
		)
		loadingText.setOrigin(0.5)

		// Helper function to create animation if it doesn't exist
		const createAnimationIfNotExists = (
			key,
			textureKey,
			start,
			end,
			frameRate,
			repeat,
			hideOnComplete,
		) => {
			if (!this.anims.exists(key)) {
				this.anims.create({
					key: key,
					frames: this.anims.generateFrameNumbers(textureKey, {
						start: start,
						end: end,
					}),
					frameRate: frameRate,
					repeat: repeat,
					hideOnComplete: hideOnComplete,
				})
			}
		}

		// Mapping of selectedPlayerIndex to animation details
		const bulletAnimations = {
			1: {
				key: 'bullet1_anim',
				textureKey: 'bullet1_texture',
				start: 0,
				end: 1,
				frameRate: 12,
				repeat: -1,
			},
			2: {
				key: 'bullet2_anim',
				textureKey: 'bullet2_texture',
				start: 0,
				end: 5,
				frameRate: 30,
				repeat: -1,
			},
			3: {
				key: 'bullet3_anim',
				textureKey: 'bullet3_texture',
				start: 0,
				end: 4,
				frameRate: 30,
				repeat: -1,
			},
			4: {
				key: 'bullet4_anim',
				textureKey: 'bullet4_texture',
				start: 0,
				end: 5,
				frameRate: 20,
				repeat: -1,
			},
			5: {
				key: 'bullet5_anim',
				textureKey: 'bullet5_texture',
				start: 0,
				end: 3,
				frameRate: 30,
				repeat: -1,
			},
			6: {
				key: 'bullet6_anim',
				textureKey: 'bullet6_texture',
				start: 0,
				end: 2,
				frameRate: 12,
				repeat: -1,
			},
			7: {
				key: 'bullet7_anim',
				textureKey: 'bullet7_texture',
				start: 0,
				end: 3,
				frameRate: 30,
				repeat: -1,
			},
			8: {
				key: 'bullet8_anim',
				textureKey: 'bullet8_texture',
				start: 0,
				end: 5,
				frameRate: 30,
				repeat: -1,
			},
			9: {
				key: 'bullet9_anim',
				textureKey: 'bullet9_texture',
				start: 0,
				end: 3,
				frameRate: 30,
				repeat: -1,
			},
		}

		// Create the appropriate animation based on selectedPlayerIndex
		const bulletAnimation = bulletAnimations[gameSettings.selectedPlayerIndex] // temporary to default bullet
		if (bulletAnimation) {
			createAnimationIfNotExists.call(
				this,
				bulletAnimation.key,
				bulletAnimation.textureKey,
				bulletAnimation.start,
				bulletAnimation.end,
				bulletAnimation.frameRate,
				bulletAnimation.repeat,
			)
		}

		// Mapping of animation keys to their details
		const playerAnimations = [
			{ key: 'player_anim', start: 0, end: 3 },
			{ key: 'player_anim_left', start: 4, end: 7 },
			{ key: 'player_anim_left_diagonal', start: 8, end: 11 },
			{ key: 'player_anim_right', start: 12, end: 15 },
			{ key: 'player_anim_right_diagonal', start: 16, end: 19 },
		]

		// Create player animations
		playerAnimations.forEach((anim) => {
			createAnimationIfNotExists.call(
				this,
				anim.key,
				`player_texture_${this.selectedPlayerIndex}`,
				anim.start,
				anim.end,
				30,
				-1,
			)
		})

		const effectAnimations = {
			1: {
				key: 'effect1_anim',
				textureKey: 'effect1_texture',
				start: 45,
				end: 59,
				frameRate: 14,
				repeat: 0,
				hideOnComplete: true,
			},
			2: {
				key: 'effect2_anim',
				textureKey: 'effect2_texture',
				start: 14,
				end: 27,
				frameRate: 20,
				repeat: 1,
				hideOnComplete: true,
			},
			3: {
				key: 'effect3_anim',
				textureKey: 'effect3_texture',
				start: 0,
				end: 19,
				frameRate: 20,
				repeat: 0,
				hideOnComplete: true,
			},
			4: {
				key: 'effect4_anim',
				textureKey: 'effect4_texture',
				start: 0,
				end: 12,
				frameRate: 13,
				repeat: 0,
				hideOnComplete: true,
			},
			5: {
				key: 'effect5_anim',
				textureKey: 'effect5_texture',
				start: 0,
				end: 15,
				frameRate: 16,
				repeat: 0,
				hideOnComplete: true,
			},
			6: {
				key: 'effect6_anim',
				textureKey: 'effect6_texture',
				start: 0,
				end: 29,
				frameRate: 30,
				repeat: 0,
				hideOnComplete: true,
			},
			7: {
				key: 'effect7_anim',
				textureKey: 'effect7_texture',
				start: 55,
				end: 65,
				frameRate: 10,
				repeat: 0,
				hideOnComplete: true,
			},
			8: {
				key: 'effect8_anim',
				textureKey: 'effect8_texture',
				start: 0,
				end: 29,
				frameRate: 30,
				repeat: 0,
				hideOnComplete: true,
			},
			9: {
				key: 'effect9_anim',
				textureKey: 'effect9_texture',
				start: 0,
				end: 29,
				frameRate: 30,
				repeat: 0,
				hideOnComplete: true,
			},
		}

		const effectAnimation = effectAnimations[gameSettings.selectedPlayerIndex] // temporary to default effect
		if (effectAnimation) {
			createAnimationIfNotExists.call(
				this,
				effectAnimation.key,
				effectAnimation.textureKey,
				effectAnimation.start,
				effectAnimation.end,
				effectAnimation.frameRate,
				effectAnimation.repeat,
				effectAnimation.hideOnComplete,
			)
		}

		// Load enemy effects
		createAnimationIfNotExists.call(
			this,
			'bounce_effect_anim',
			'bounce_effect_texture',
			0,
			41,
			60,
			0,
			true,
		)

		createAnimationIfNotExists.call(
			this,
			'electric_effect_anim',
			'electric_effect_texture',
			0,
			41,
			20,
			0,
			true,
		)

		createAnimationIfNotExists.call(
			this,
			'time_effect_anim',
			'time_effect_texture',
			0,
			45,
			45,
			0,
			true,
		)

		createAnimationIfNotExists.call(
			this,
			'poison_effect_anim',
			'poison_effect_texture',
			0,
			41,
			20,
			0,
			true,
		)

		// Mapping of animation keys to their details
		const animations = [
			{
				key: 'bulletChase_anim',
				textureKey: 'bulletChase_texture',
				start: 0,
				end: 16,
				frameRate: 32,
				repeat: -1,
			},
			{
				key: 'boss_move_anim',
				textureKey: 'boss_texture',
				start: 0,
				end: 3,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'boss_shoot_anim',
				textureKey: 'boss_texture',
				start: 0,
				end: 7,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'bug1_anim',
				textureKey: 'bug1_texture',
				start: 0,
				end: 5,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'bug3_anim',
				textureKey: 'bug3_texture',
				start: 0,
				end: 5,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'bug5_anim',
				textureKey: 'bug5_texture',
				start: 0,
				end: 5,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'healthPack_anim',
				textureKey: 'healthPack_texture',
				start: 0,
				end: 4,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'shieldPack_anim',
				textureKey: 'shieldPack_texture',
				start: 0,
				end: 4,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'shield_anim',
				textureKey: 'shield_texture',
				start: 0,
				end: 5,
				frameRate: 20,
				repeat: -1,
			},
			{
				key: 'explosion_anim',
				textureKey: 'explosion_texture',
				start: 0,
				end: 10,
				frameRate: 30,
				repeat: 0,
				hideOnComplete: true,
			},
			{
				key: 'pauseDis_anim',
				textureKey: 'pauseDis_texture',
				start: 0,
				end: 1,
				frameRate: 60,
				repeat: 0,
				hideOnComplete: true,
			},
		]

		// Create animations for various entities
		animations.forEach((anim) => {
			createAnimationIfNotExists.call(
				this,
				anim.key,
				anim.textureKey,
				anim.start,
				anim.end,
				anim.frameRate,
				anim.repeat,
				anim.hideOnComplete,
			)
		})

		// Create loading text
		this.time.delayedCall(1000, () => {
			let value = this.selectedPlayerIndex
			this.scene.start('playGame', { number: value })
		})
	}
}

export default LoadingScreen
