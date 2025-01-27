import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
import config from '../../config/config.js'
import Bug3 from '../enemies/Bug3.js'

class BoundBullet extends Entity {
	constructor(scene, enemy, x = null, y = null, rotation = null, angle = null) {
		let posX, posY

		if (x === null && y === null) {
			posX = enemy.x
			posY = enemy.y + 10
		} else {
			posX = enemy.x + x
			posY = enemy.y + y
		}

		super(scene, posX, posY, 'bullet_texture', 'bullet', 1)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.enemyProjectiles.add(this)

		this.damage = gameSettings.enemyBulletDamage
		this.setDepth(1)

		this.body.setSize(16, 16, true)

		this.body.setBounce(1).setCollideWorldBounds(true)

		// Initialize bounce counter and limit
		this.bounceCount = 0
		this.bounceLimit = 1 // Set your desired bounce limit here

		// Add a collision callback to track bounces
		scene.physics.world.on('worldbounds', (body) => {
			if (body.gameObject === this) {
				this.bounceCount++
				if (this.bounceCount >= this.bounceLimit) {
					this.body.setBounce(0) // Disable bounce after reaching the limit
				}
			}
		})

		if (rotation !== null && angle !== null) {
			this.initialBulletForBoss(rotation, angle)
		} else {
			this.initializeVelocity()
		}
	}

	initialBulletForBoss(rotation, angle) {
		// Convert angle from radians to degrees
		this.angle = angle * (180 / Math.PI) + 90

		let direction = rotation
		this.body.velocity.set(
			(direction.x * gameSettings.bulletSpeed) / 3,
			(direction.y * gameSettings.bulletSpeed) / 3,
		)
	}

	initializeVelocity() {
		// Calculate the direction vector from enemy to player
		let direction = new Phaser.Math.Vector2(
			this.scene.player.x - this.x,
			this.scene.player.y - this.y,
		)

		// Normalize the direction vector (convert it to a vector of length 1)
		direction.normalize()

		// Set the velocity of the bullet
		this.body.velocity.set(
			(direction.x * gameSettings.bulletSpeed) / 2,
			(direction.y * gameSettings.bulletSpeed) / 2,
		)

		// Calculate the angle in radians from the direction vector
		let angle = Math.atan2(direction.y, direction.x)

		// Convert the angle to degrees and set it to the angle of the bullet sprite
		let pi = Math.PI

		this.angle = Phaser.Math.RadToDeg(angle) + 90
	}

	update() {
		if (this.y < 20 || !this.active) {
			this.destroy()
		}

		if (this.x <= 0 || this.x >= config.width) {
			this.destroy()
		}
	}

	destroy() {
		// Call the parent destroy method if needed
		super.destroy()
	}
}

export default BoundBullet
