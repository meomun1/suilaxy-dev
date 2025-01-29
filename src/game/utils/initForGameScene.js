import Phaser from 'phaser'
import config from '../config/config.js'
import Shield from '../objects/utilities/Shield.js'
import EnemyManager from '../manager/EnemyManager.js'
import KeyboardManager from '../manager/KeyboardManager.js'
import PlayerManager from '../manager/PlayerManager.js'
import UtilitiesManager from '../manager/UtilitiesManager.js'
import ProjectileManager from '../manager/ProjectileManager.js'
import UpgradeManager from '../manager/UpgradeManager.js'
import SoundManager from '../manager/SoundManager.js'
import MobileManager from '../manager/MobileManager.js'
import gameSettings from '../config/gameSettings.js'
import SpecialPlayers from '../objects/players/SpecialPlayers.js'
import { gameStats } from './adjustStats.js'
import PlayingScreen from '../scenes/PlayingScreen.js'
import LevelTwoScreen from '../scenes/LevelTwoScreen.js'
import BossScreen from '../scenes/BossScreen.js'

const createObject = (scene) => {
	scene.player = new SpecialPlayers(
		scene,
		config.width / 2,
		config.height - config.height / 4,
		`player_texture_${scene.selectedPlayerIndex}`,
		gameSettings.playerMaxHealth,
		gameSettings.selectedPlayerIndex,
	)
	scene.player.play('player_anim')
	gameStats()

	//SHIELD
	scene.shield = new Shield(scene, scene.player)
	scene.shield.play('shield_anim')
}

const createMechanic = (scene) => {
	// Create keyboard inputs
	scene.spacebar = scene.input.keyboard.addKey(
		Phaser.Input.Keyboard.KeyCodes.SPACE,
	)
	scene.enter = scene.input.keyboard.addKey(
		Phaser.Input.Keyboard.KeyCodes.ENTER,
	)

	// Create a group to manage bullets
	scene.projectileManager = new ProjectileManager(scene)
	if (scene.selectedPlayerIndex === 6) {
		scene.projectileManager.createShieldCover()
	} else if (scene.selectedPlayerIndex === 8) {
		scene.projectileManager.createWingCover()
	} else if (scene.selectedPlayerIndex === 1) {
		scene.projectileManager.createRandomBullet()
	} else {
		scene.projectileManager.createPlayerBullet()
	}

	scene.projectileManager.createEnemyEffect()
	scene.projectileManager.createEffect()
	scene.projectileManager.createEnemyBullet()
	scene.projectileManager.createChaseBullet()

	if (scene instanceof PlayingScreen) {
		scene.time.addEvent({
			delay: 21000,
			callback: () => {
				scene.projectileManager.callEnemyBulletLv1()
				scene.projectileManager.callChaseBulletLv1()
			},
			callbackScope: scene,
		})
	}

	if (scene instanceof LevelTwoScreen) {
		scene.time.addEvent({
			delay: 24500,
			callback: () => {
				scene.projectileManager.callEnemyBulletLv2()
			},
			callbackScope: scene,
		})
	}

	if (scene instanceof BossScreen) {
		scene.projectileManager.callEnemyBulletBoss()
		scene.projectileManager.callChaseBulletBoss()
	}
}

const createManager = (scene) => {
	// Create managers
	scene.keyboardManager = new KeyboardManager(scene, scene.music)
	scene.mobileManager = new MobileManager(scene)
	scene.keyboardManager.MuteGame()
	// Score System
	scene.UpgradeManager = new UpgradeManager(scene, scene.callingScene)
	scene.PlayerManager = new PlayerManager(
		scene,
		scene.player,
		scene.selectedPlayerIndex,
	)

	scene.EnemyManager = new EnemyManager(scene)
	scene.UtilitiesManager = new UtilitiesManager(scene)
	scene.SoundManager = new SoundManager(scene)
}

const createMusic = (scene) => {
	// create pause button
	scene.pic = scene.add.image(config.width - 20, 30, 'pause')
	// scene.button = scene.scene.add.sprite(60, 30, 'pause');
	scene.pic.setInteractive()

	scene.pic.on(
		'pointerdown',
		function () {
			scene.scene.pause()
			scene.scene.launch('pauseScreen', { key: 'playGame' })
		},
		scene,
	)

	scene.musicButton = scene.add.image(config.width - 60, 30, 'sound_texture')
	scene.musicButton.setInteractive()

	scene.musicButton.on(
		'pointerdown',
		function () {
			scene.music.soundOn = !scene.music.soundOn
			scene.music.musicOn = !scene.music.musicOn

			scene.updateAudio()
		},
		scene,
	)
}

export const createShipAnimations = (scene) => {
	if (
		!(scene.anims && scene.anims.exists && scene.anims.exists('player_anim'))
	) {
		scene.anims.create({
			key: 'player_anim',
			frames: scene.anims.generateFrameNumbers(
				`player_texture_${scene.selectedPlayerIndex}`,
				{
					start: 0,
					end: 3,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		scene.anims.create({
			key: 'player_anim_left',
			frames: scene.anims.generateFrameNumbers(
				`player_texture_${scene.selectedPlayerIndex}`,
				{
					start: 4,
					end: 7,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		scene.anims.create({
			key: 'player_anim_left_diagonal',
			frames: scene.anims.generateFrameNumbers(
				`player_texture_${scene.selectedPlayerIndex}`,
				{
					start: 8,
					end: 11,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		scene.anims.create({
			key: 'player_anim_right',
			frames: scene.anims.generateFrameNumbers(
				`player_texture_${scene.selectedPlayerIndex}`,
				{
					start: 12,
					end: 15,
				},
			),
			frameRate: 30,
			repeat: -1,
		})

		scene.anims.create({
			key: 'player_anim_right_diagonal',
			frames: scene.anims.generateFrameNumbers(
				`player_texture_${scene.selectedPlayerIndex}`,
				{
					start: 16,
					end: 19,
				},
			),
			frameRate: 30,
			repeat: -1,
		})
	}
}

export const createScene = (scene) => {
	createObject(scene)
	createMechanic(scene)
	createManager(scene)
	createMusic(scene)
	createShipAnimations(scene)
}
