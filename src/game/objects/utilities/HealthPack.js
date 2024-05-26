import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
import Phaser from 'phaser'

class HealthPack extends Entity {
	constructor(scene, x, y) {
		super(scene, x, y, 'healthPack_texture') // Replace with your health pack texture key
		scene.add.existing(this)
		scene.physics.add.existing(this)

		this.setRandomVelocity()
		this.setInteractiveEntity()
		this.body.setCollideWorldBounds(true) // Semicolon here instead of dot
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

export default HealthPack
