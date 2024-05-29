import Phaser from 'phaser'
import HealthPack from '../objects/utilities/HealthPack'
import ShieldPack from '../objects/utilities/ShieldPack'
import NftCollection from '../objects/utilities/NftCollection'
import config from '../config/config'
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

	addNftForPlayer(){
		const randomPos = this.generateRandomPosition()
		this.nftCollection = new NftCollection(this.scene, config.width/2, config.height/2)
		this.nftCollection.setTexture('nft_texture')
		this.nftCollection.setScale(0.25);
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
			// const shieldPack3 = new ShieldPack(this.scene, config.width / 2, 30);
			// shieldPack3.play("shieldPack_anim");
			this.addHealthPack(healthPack)
		}
	}

	addHealthPack(HealthPack) {
		this.HealthPacks.push(HealthPack)
		// ... other code for managing respawn delays, etc.
	}

	addShieldPack(ShieldPack) {
		this.shieldPacks.push(ShieldPack)
		// ... other code for managing respawn delays, etc.
	}

	// update(time) {
	//   this.timeElapsed += time;

	//   if (!this.shieldPacksSpawned && this.timeElapsed >= this.delayTime) {
	//     this.shieldPacks.forEach((shieldPack) => {
	//       shieldPack.setActive(true);
	//       shieldPack.setVisible(true);
	//     });
	//     this.shieldPacksSpawned = true;
	//   }
	// Other update logic
}
// addUtility(utility) {
//   // When adding a new enemy, initialize its random delay and last respawn time
//   this.Utilities.push(utility);
//   // this.respawnDelays.push(Phaser.Math.Between(5000, 7000));
//   // this.lastRespawnTimes.push(0);
// }

export default UtilitiesManager
