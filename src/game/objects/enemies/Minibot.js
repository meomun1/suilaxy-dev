import Entity from '../Entity'
import gameSettings from '../../config/gameSettings'
import HPBar from '../ui/HPBar'
import EnemyBullet from '../projectiles/EnemyBullet'

class MiniBot extends Entity {
	constructor(scene, x, y, health) {
		super(scene, x, y, 'mini_texture', health)
		this.body.velocity.y = 0
		this.health = health
		this.maxHealth = health
		this.hpBarWidth = 20
		this.hpBarHeight = 5
		this.damage = 100
		this.shootDamage = 50
		this.setInteractiveEntity()
		this.setDepth(1)

		this.isDestroyed = false

		this.hpBar = new HPBar(
			scene,
			this.x,
			this.y,
			this.hpBarWidth,
			this.hpBarHeight,
			this.health,
			this.maxHealth,
		)
		this.scene.add.existing(this.hpBar)
	}

	followPlayer(player, offsetX, offsetY) {
		if (this.health > 0) {
			let dx = player.x - this.x
			let dy = player.y - this.y

			let distance = Math.sqrt(dx * dx + dy * dy) // Calculate the distance between the minibot and the player

			let distanceCondition = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

			if (
				player.body.velocity.x === 0 &&
				player.body.velocity.y === 0 &&
				distance <= distanceCondition
			) {
				this.body.velocity.set(0, 0)
			} else {
				this.rotation = Math.atan2(dy, dx) + (Math.PI * 3) / 2

				let direction = new Phaser.Math.Vector2(dx + offsetX, dy + offsetY)

				direction.normalize()

				this.body.velocity.set(
					direction.x * gameSettings.playerSpeed,
					direction.y * gameSettings.playerSpeed,
				)
			}
		}
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
	explode(canDestroy) {
		super.explode(canDestroy)
		this.scene.UpgradeManager.updateScore(500)
	}

	shootBullet(scene, enemy) {
		if (this.health > 0) {
			const enemyBullet = new EnemyBullet(scene, enemy)
		}
	}
}

export default MiniBot
