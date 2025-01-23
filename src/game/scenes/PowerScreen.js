import Phaser from 'phaser'
import config from '../config/config'
import gameSettings from '../config/gameSettings'
import GuiManager from '../manager/GuiManager'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { EventBus } from '../EventBus.js'

class PowerScreen extends Phaser.Scene {
	constructor() {
		super('powerScreen')
		this.guiManager = new GuiManager(this)
	}

	preload() {
		// Load upgrade images
		this.load.image('all', 'assets/images/power/all.png')
		this.load.image('dark', 'assets/images/power/dark.png')
		this.load.image('earth', 'assets/images/power/earth.png')
		this.load.image('moon', 'assets/images/power/moon.png')
		this.load.image('ocean', 'assets/images/power/ocean.png')
		this.load.image('sky', 'assets/images/power/sky.png')
		this.load.image('star', 'assets/images/power/star.png')
		this.load.image('sun', 'assets/images/power/sun.png')
		this.load.image('flare', 'assets/images/power/white-flare.png')
	}

	init(data) {
		this.callingScene = data.callingScene
		this.selectedPlayerIndex = data.number
	}

	create() {
		EventBus.on('wallet-connected', handleWalletConnected, this)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		// Get the calling scene name
		this.guiManager.createBackground('background')

		this.cameras.main.fadeIn(500, 0, 0, 0)

		this.guiManager.createAnimatedTextSize(
			'CALL THE ELEMENT',
			(-1.75 * config.height) / 4,
			`${config.height / 8 - config.height / 32}px`,
		)

		this.cameras.main.setAlpha(0.9)

		// Array of image keys
		const imageKeys = [
			'all',
			'dark',
			'earth',
			'moon',
			'ocean',
			'sky',
			'star',
			'sun',
		]

		// Function to get a random image key
		const getRandomImageKey = () => {
			const randomIndex = Phaser.Math.Between(0, imageKeys.length - 1)
			return imageKeys.splice(randomIndex, 1)[0]
		}

		// Display three random images
		const centerX = config.width / 2
		const centerY = config.height / 2 - config.height / 32
		const imageWidth = 100 // Assuming each image has an approximate width of 100 pixels
		const totalWidth = 3 * imageWidth
		const spacing = (config.width - totalWidth) / 4 // Calculate spacing dynamically

		const images = []
		const texts = []

		for (let i = 0; i < 3; i++) {
			const imageKey = getRandomImageKey()
			const image = this.add
				.image(centerX + (i - 1) * (imageWidth + spacing), centerY, imageKey)
				.setInteractive()
			image.setScale(1 / 2.3) // Scale down the image to one-third of its original size
			images.push(image)

			const text = this.add.text(
				image.x,
				image.y + config.height / 4 + config.height / 8 + config.height / 32,
				this.getUpgradeText(imageKey),
				{
					fontSize: '24px',
					color: '#ffffff',
					align: 'center',
					wordWrap: { width: 3 * imageWidth, useAdvancedWrap: true },
				},
			)
			text.setOrigin(0.5)
			texts.push(text)
		}

		// Create emit zones for each image
		const emitZones = images.map(
			(image) =>
				new Phaser.GameObjects.Particles.Zones.EdgeZone(image.getBounds(), 42),
		)

		// Create the particle emitter
		const emitter = this.add.particles(0, 0, 'flare', {
			speed: 15,
			lifespan: 1500,
			quantity: 5,
			scale: { start: 0.1, end: 0 },
			advance: 2000,
			emitZone: [emitZones[0], emitZones[1], emitZones[2]], // Default to the first image's zone
		})

		// Add pointerover events to each image
		images.forEach((image, index) => {
			image.on('pointerover', () => {
				emitter.setEmitZone(emitZones[index])
				emitter.fastForward(2000)
			})

			image.on('pointerdown', () => {
				images.forEach((img, idx) => {
					if (idx !== index) {
						img.setVisible(false)
						texts[idx].setVisible(false)
					} else {
						texts[idx].setVisible(true)
					}
				})
				this.handleUpgradeChoice(image.texture.key)
			})
		})
	}

	getUpgradeText(upgradeType) {
		switch (upgradeType) {
			case 'all':
				return 'Increase all power by 25%'
			case 'dark':
				return 'Reduce health by 50% and increase damage by 100%'
			case 'earth':
				return 'Increase health by 200%'
			case 'moon':
				return 'Add 3 bullets to each shot'
			case 'ocean':
				return 'Increase bullet size by 100%'
			case 'sky':
				return 'Increase speed by 100%'
			case 'star':
				return 'Increase fire rate by 100%'
			case 'sun':
				return 'Increase damage by 50%'
			default:
				return ''
		}
	}

	handleUpgradeChoice(choice) {
		switch (choice) {
			case 'all':
				gameSettings.savePlayerSpeed =
					gameSettings.savePlayerSpeed * 1.25 * gameSettings.savePlayerBuffRate

				gameSettings.savePlayerBulletDamage =
					gameSettings.savePlayerBulletDamage *
					1.25 *
					gameSettings.savePlayerBuffRate

				gameSettings.savePlayerLifesteal =
					gameSettings.savePlayerLifesteal *
					1.25 *
					gameSettings.savePlayerBuffRate

				gameSettings.savePlayerBulletSpeed =
					gameSettings.savePlayerBulletSpeed *
					1.25 *
					gameSettings.savePlayerBuffRate
				gameSettings.savePlayerMaxHealth =
					gameSettings.savePlayerMaxHealth *
					1.25 *
					gameSettings.savePlayerBuffRate

				gameSettings.savePlayerBulletSize =
					gameSettings.savePlayerBulletSize *
					1.25 *
					gameSettings.savePlayerBuffRate

				gameSettings.savePlayerFireRate =
					gameSettings.savePlayerFireRate *
					1.25 *
					gameSettings.savePlayerBuffRate

				gameSettings.savePlayerNumberOfBullets =
					gameSettings.savePlayerNumberOfBullets + 1
				break

			case 'dark':
				gameSettings.savePlayerMaxHealth =
					gameSettings.savePlayerMaxHealth *
					0.5 *
					gameSettings.savePlayerBuffRate
				gameSettings.savePlayerBulletDamage =
					gameSettings.savePlayerBulletDamage *
					2 *
					gameSettings.savePlayerBuffRate
				break

			case 'earth':
				gameSettings.savePlayerMaxHealth =
					gameSettings.savePlayerMaxHealth * 2 * gameSettings.savePlayerBuffRate
				break

			case 'moon':
				if (gameSettings.savePlayerNumberOfBullets + 3 <= 10) {
					gameSettings.savePlayerNumberOfBullets =
						gameSettings.savePlayerNumberOfBullets + 3
				} else {
					gameSettings.savePlayerNumberOfBullets = 10
				}

				break

			case 'ocean':
				gameSettings.savePlayerBulletSize =
					gameSettings.savePlayerBulletSize *
					2 *
					gameSettings.savePlayerBuffRate
				break

			case 'sky':
				gameSettings.savePlayerSpeed =
					gameSettings.savePlayerSpeed * 2 * gameSettings.savePlayerBuffRate
				break

			case 'star':
				gameSettings.savePlayerFireRate =
					gameSettings.savePlayerFireRate /
					(2 * gameSettings.savePlayerBuffRate)
				break

			case 'sun':
				gameSettings.savePlayerBulletDamage =
					gameSettings.savePlayerBulletDamage *
					1.5 *
					gameSettings.savePlayerBuffRate
				break

			default:
				break
		}

		this.handleTransition()
	}

	handleTransition() {
		this.time.delayedCall(1000, () => {
			this.cameras.main.fadeOut(1000, 0, 0, 0)
			this.cameras.main.once(
				Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
				(cam, effect) => {
					this.scene.stop()
					if (this.callingScene === 'playGame') {
						this.scene.start('playLevelTwo', {
							callingScene: this.callingScene,
							number: this.selectedPlayerIndex,
						})
					}

					if (this.callingScene === 'playLevelTwo') {
						this.scene.start('playLevelThree', {
							callingScene: this.callingScene,
							number: this.selectedPlayerIndex,
						})
					}

					if (this.callingScene === 'playLevelThree') {
						this.scene.start('NewShipScreen', {
							callingScene: this.callingScene,
							number: this.selectedPlayerIndex,
						})
					}
				},
			)
		})
	}
}

export default PowerScreen
