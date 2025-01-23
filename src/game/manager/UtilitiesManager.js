import Phaser from 'phaser'
import HealthPack from '../objects/utilities/HealthPack'
import ShieldPack from '../objects/utilities/ShieldPack'
// import NftCollection from '../objects/utilities/NftCollection'
// import config from '../config/config'
class UtilitiesManager {
	constructor(scene) {
		this.scene = scene
		this.HealthPacks = []
		this.shieldPacks = []
		this.delayTime = 3000 // Set your desired delay time in milliseconds
		this.timeElapsed = 0
		this.shieldPacksSpawned = false
		this.nftCollection = null
	}

	generateRandomPosition() {
		const minX = 50 // Minimum X position
		const maxX = this.scene.sys.game.config.width - 50 // Maximum X position
		const minY = 50 // Minimum Y position
		const maxY = this.scene.sys.game.config.height - 50 // Maximum Y position

		const randomX = Phaser.Math.Between(minX, maxX)
		const randomY = Phaser.Math.Between(minY, maxY)

		return { x: randomX, y: randomY }
	}
	addUtilitiesForPlayingScreen(numHealth, numShield) {
		for (let i = 0; i < numHealth; i++) {
			const randomPos = this.generateRandomPosition()
			const shieldPack = new ShieldPack(this.scene, randomPos.x, randomPos.y)
			shieldPack.play('shieldPack_anim')
			// const shieldPack3 = new ShieldPack(this.scene, config.width / 2, 30);
			// shieldPack3.play("shieldPack_anim");
			this.addShieldPack(shieldPack)
		}
		for (let j = 0; j < numShield; j++) {
			const randomPos = this.generateRandomPosition()
			const healthPack = new HealthPack(this.scene, randomPos.x, randomPos.y)
			healthPack.play('healthPack_anim')
			this.addHealthPack(healthPack)
		}
	}

	addHealthPack(HealthPack) {
		this.HealthPacks.push(HealthPack)
	}

	addShieldPack(ShieldPack) {
		this.shieldPacks.push(ShieldPack)
	}
}

export default UtilitiesManager
