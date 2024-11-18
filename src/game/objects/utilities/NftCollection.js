import Entity from '../Entity.js'
import Phaser from 'phaser'

class NftCollection extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, 'nft_texture')
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// Randomly set initial velocity for movement
		this.setRandomVelocity()
		this.setInteractiveEntity()
		this.body.setCollideWorldBounds(true)
		this.body.setBounce(1)
	}

	setRandomVelocity() {
		const randomVelocityX = Phaser.Math.Between(-100, 100)
		const randomVelocityY = Phaser.Math.Between(-100, 100)
		this.body.setVelocity(randomVelocityX, randomVelocityY)
	}

	onDestroy() {
		super.onDestroy()
	}

	setInteractiveEntity() {
		super.setInteractiveEntity()
	}
}

export default NftCollection
