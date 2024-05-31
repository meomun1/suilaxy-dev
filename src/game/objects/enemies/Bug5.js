import Entity from '../Entity'
import gameSettings from '../../config/gameSettings'
import HPBar from '../ui/HPBar'
import config from '../../config/config'

class Bug5 extends Entity {
	constructor(scene, x, y, health, scale = 1) {
		super(scene, x, y, 'bug5_texture', health)

		// Set the scale of the bug sprite
		this.setScale(scale)

		this.body.velocity.y = gameSettings.enemySpeed
		this.health = health
		this.maxHealth = health
		this.hpBarWidth = 20
		this.hpBarHeight = 5
		this.damage = 100
		this.setInteractiveEntity()
		this.setActive(true)

		const scaledHpBarWidth = this.hpBarWidth * scale
		const scaledHpBarHeight = this.hpBarHeight * scale

		this.hpBar = new HPBar(
			scene,
			this.x,
			this.y - scaledHpBarHeight - 5,
			scaledHpBarWidth,
			scaledHpBarHeight,
			this.health,
			this.maxHealth,
		)
		this.scene.add.existing(this.hpBar)
	}

	setVelocityY(velocity) {
		super.setVelocityY(velocity)
	}

	setVelocityX(velocity) {
		super.setVelocityX(velocity)
	}

	setInteractiveEntity() {
		super.setInteractiveEntity()
	}

	set0health() {
		this.health = 0
		this.updateHealthBarValue()
	}
	chasePlayer(player, speed = 200) {
		if (this.y >= config.height / 2 && this.health > 0) {
			let dx = player.x - this.x
			let dy = player.y - this.y

			this.rotation = Math.atan2(dy, dx) + (Math.PI * 3) / 2

			let direction = new Phaser.Math.Vector2(
				this.scene.player.x - this.x,
				this.scene.player.y - this.y,
			)

			// Normalize the direction vector (convert it to a vector of length 1)
			direction.normalize()

			// If it has, set its y velocity to 0 to stop it
			this.body.velocity.set(
				(direction.x * speed) / 2,
				(direction.y * speed) / 2,
			)
		}
	}

	explode(canDestroy) {
		super.explode(canDestroy)
		this.scene.player.getHeal(this.scene.player.lifestealRate)
		this.scene.UpgradeManager.updateScore(100)
	}
}

export default Bug5
