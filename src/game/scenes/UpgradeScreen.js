import Phaser from 'phaser'
import config from '../config/config'
import GameSettings from '../config/gameSettings'
class UpgradeScreen extends Phaser.Scene {
	constructor() {
		super('upgradeScreen')
	}

	preload() {
		// Load upgrade images
		this.load.image('upgrade1', 'assets/images/upgrades/upgrade_01.png')
		this.load.image('upgrade2', 'assets/images/upgrades/upgrade_02.png')
		this.load.image('upgrade3', 'assets/images/upgrades/upgrade_03.png')
		this.load.image('upgrade4', 'assets/images/upgrades/upgrade_04.png')
		this.load.image('upgrade5', 'assets/images/upgrades/upgrade_05.png')
		this.load.image('upgrade6', 'assets/images/upgrades/upgrade_06.png')
		this.load.image('upgrade7', 'assets/images/upgrades/upgrade_07.png')
		this.load.image('upgrade8', 'assets/images/upgrades/upgrade_08.png')
	}

	create(data) {
		// Get the calling scene name
		this.callbackSceneName = data.callingScene

		this.cameras.main.setAlpha(0.9)

		const middleX = config.width / 2
		const middleY = (config.height - 100) / 2

		const rowGap = 150

		// Create an array of available upgrades
		const availableUpgrades = [
			'upgrade1',
			'upgrade2',
			'upgrade3',
			'upgrade4',
			'upgrade5',
			'upgrade6',
			'upgrade7',
			'upgrade8',
		]

		// Shuffle the array to randomize the upgrades
		Phaser.Math.RND.shuffle(availableUpgrades)

		for (let i = 0; i < 3; i++) {
			const upgradeRect = this.add.rectangle(
				middleX,
				middleY - 150 + i * rowGap,
				400,
				80,
				0x000000,
			)
			upgradeRect.setInteractive()

			const upgradeImage = this.add.sprite(
				middleX - 150,
				middleY - 150 + i * rowGap,
				availableUpgrades[i],
			)
			upgradeImage.setOrigin(0.5, 0.5)

			const upgradeText = this.add.text(
				middleX - 70,
				middleY - 150 + i * rowGap,
				this.getUpgradeText(availableUpgrades[i]),
				{
					fontSize: '16px',
					fontFamily: 'Pixelify Sans',
					fill: '#fff',
					align: 'center',
				},
			)
			upgradeText.setOrigin(0, 0.5)

			// Event listener for upgrades
			upgradeRect.on('pointerover', () => {
				upgradeRect.setFillStyle(0x333333)
			})
			upgradeRect.on('pointerout', () => {
				upgradeRect.setFillStyle(0x000000)
			})

			upgradeRect.on('pointerdown', () =>
				this.handleUpgradeChoice(availableUpgrades[i], this.callbackSceneName),
			)

			// Set depth
			upgradeRect.setDepth(3)
			upgradeImage.setDepth(4)
			upgradeText.setDepth(4)
		}
	}

	getUpgradeText(upgradeType) {
		switch (upgradeType) {
			case 'upgrade1':
				return 'Hard As Rock (+MaxHP and HEAL)'
			case 'upgrade2':
				return 'Wormhole Engine (+Speed)'
			case 'upgrade3':
				return 'Sharp Eye Bullseye (+Damage)'
			case 'upgrade4':
				return 'Stained Warrior (UNKNOWN)'
			case 'upgrade5':
				return 'Energy Fluid (+Lifesteal)'
			case 'upgrade6':
				return 'Bullet Barrage (+Bullet)'
			case 'upgrade7':
				return 'Ratatata (+Fire Rate)'
			case 'upgrade8':
				return 'Zoom Zoom (+Bullet Speed)'
			default:
				return ''
		}
	}

	handleUpgradeChoice(choice, callingScene) {
		const playGameScene = this.scene.get(callingScene)
		const player = playGameScene.player

		switch (choice) {
			case 'upgrade1':
				GameSettings.playerMaxHealth += 300
				player.maxHealth = GameSettings.playerMaxHealth
				player.health = GameSettings.playerMaxHealth
				player.updateHealthBarValue()
				break

			case 'upgrade2':
				GameSettings.playerSpeed += 50
				player.speed = GameSettings.playerSpeed
				break

			case 'upgrade3':
				GameSettings.playerBulletDamage += 50
				player.bulletDamage = GameSettings.playerBulletDamage
				break

			case 'upgrade4':
				player.takeDamage(player.health * 0.9)
				GameSettings.playerBulletDamage += 100
				GameSettings.playerBulletSize *= 1.22
				player.bulletDamage = GameSettings.playerBulletDamage
				player.bulletSize = GameSettings.playerBulletSize
				break

			case 'upgrade5':
				GameSettings.playerLifesteal += 0.1
				player.lifestealRate =
					(GameSettings.playerLifesteal * player.bulletDamage) /
					player.numberOfBullets
				break

			case 'upgrade6':
				GameSettings.playerNumberOfBullets += 1
				player.numberOfBullets = GameSettings.playerNumberOfBullets
				break

			case 'upgrade7':
				GameSettings.playerFireRate -= this.increaseValue(
					GameSettings.playerFireRate,
					10000,
				)
				player.fireRate = GameSettings.playerFireRate
				break

			case 'upgrade8':
				GameSettings.playerBulletSpeed += 100
				player.bulletSpeed = GameSettings.playerBulletSpeed
				break
		}

		// Close the upgrade scene and resume the parent scene
		this.scene.stop()
		this.scene.resume(callingScene)
	}

	increaseValue(current, base) {
		return Math.log2(current + base) * 3.5
	}

	stop() {
		this.scene.stop()
	}
}

export default UpgradeScreen
