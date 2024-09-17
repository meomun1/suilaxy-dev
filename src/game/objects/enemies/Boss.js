import Entity from '../Entity'
import gameSettings from '../../config/gameSettings'
import HPBar from '../ui/HPBar'
import config from '../../config/config'
import EnemyBullet from '../projectiles/EnemyBullet'
import Phaser from 'phaser'

class Boss extends Entity {
	constructor(scene, x, y, health) {
		super(scene, x, y, 'boss_texture', health)
		this.body.velocity.y = gameSettings.enemySpeed
		this.health = health
		this.maxHealth = health
		this.hpBarWidth = 200
		this.hpBarHeight = 10
		this.damage = 100
		this.shootAngle = 0
		this.shootRotation = 0
		this.setInteractiveEntity()
		this.setActive(true)

		this.isDestroyed = false

		this.checkCenter = 0

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
		this.updateHealthBarPosition()
	}

	explode(canDestroy) {
		super.explode(canDestroy)
		this.scene.UpgradeManager.updateScore(1234)
	}

	shootBullet(scene, enemy) {
		if (this.health > 0) {
			const enemyBullet = new EnemyBullet(scene, enemy)
		}
	}

	shootBulletCircle(scene, enemy) {
		if (this.health > 0) {
			this.shootRotationOne = {
				x: Math.cos(this.shootAngle),
				y: Math.sin(this.shootAngle),
			}

			this.shootRotationTwo = {
				x: Math.cos(this.shootAngle + Math.PI / 2),
				y: Math.sin(this.shootAngle + Math.PI / 2),
			}

			this.shootRotationThree = {
				x: Math.cos(this.shootAngle + Math.PI),
				y: Math.sin(this.shootAngle + Math.PI),
			}

			this.shootRotationFour = {
				x: Math.cos(this.shootAngle + (3 * Math.PI) / 2),
				y: Math.sin(this.shootAngle + (3 * Math.PI) / 2),
			}

			const bossBulletOne = new EnemyBullet(
				scene,
				enemy,
				1,
				1,
				this.shootRotationOne,
				this.shootAngle,
			)

			const bossBulletTwo = new EnemyBullet(
				scene,
				enemy,
				1,
				1,
				this.shootRotationTwo,
				this.shootAngle + Math.PI / 2,
			)

			const bossBulletThree = new EnemyBullet(
				scene,
				enemy,
				1,
				1,
				this.shootRotationThree,
				this.shootAngle + Math.PI,
			)

			const bossBulletFour = new EnemyBullet(
				scene,
				enemy,
				1,
				1,
				this.shootRotationFour,
				this.shootAngle + (3 * Math.PI) / 2,
			)

			this.shootAngle += Math.PI / 180

			if (this.shootAngle === Math.PI) {
				this.shootAngle = 0
			}
		}
	}

	moveToCenter() {
		if (this.checkCenter < 150) {
			let direction = new Phaser.Math.Vector2(
				config.width / 2 - this.x,
				config.height / 3 - this.y,
			)

			// Normalize the direction vector (convert it to a vector of length 1)
			direction.normalize()

			// If it has, set its y velocity to 0 to stop it
			this.body.velocity.set(
				(direction.x * gameSettings.enemySpeed) / 2,
				(direction.y * gameSettings.enemySpeed) / 2,
			)
			this.checkCenter++
		} else {
			this.body.velocity.y = 0
			this.body.velocity.x = 0
			this.checkCenter++
			if (this.checkCenter % 45 == 0) {
				this.shootEightWay(this.scene, this)
			}
		}
	}

	bossBound() {
		// If the boss is about to move out o{f the scene bounds, set a new random velocity
		if (
			this.health < this.maxHealth * 0.55 &&
			this.health > this.maxHealth * 0.4
		) {
			let xVel = gameSettings.enemySpeed
			let yVel = gameSettings.enemySpeed

			if (this.body.velocity.x === 0) {
				this.body.velocity.x = xVel
				this.body.velocity.y = -yVel
			}
			if (this.x < 150 && this.body.velocity.x < 0) {
				this.body.velocity.x = xVel
			}
			if (this.x > config.width - 150 && this.body.velocity.x > 0) {
				this.body.velocity.x = -xVel
			}
			if (this.y < 150 && this.body.velocity.y < 0) {
				this.body.velocity.y = yVel
			}
			if (this.y > config.height - 150 && this.body.velocity.y > 0) {
				this.body.velocity.y = -yVel
			}
		} else {
			let xVel = 0.5 * gameSettings.enemySpeed
			let yVel = 0.5 * gameSettings.enemySpeed
			this.checkCenter++

			if (this.body.velocity.x === 0) {
				this.body.velocity.x = xVel
			}
			if (this.x < 150 && this.body.velocity.x < 0) {
				this.body.velocity.x = xVel
			}
			if (this.x > config.width - 150 && this.body.velocity.x > 0) {
				this.body.velocity.x = -xVel
			}
			if (this.y < 150 && this.body.velocity.y < 0) {
				this.body.velocity.y = yVel
			}
			if (this.y > config.height - 150 && this.body.velocity.y > 0) {
				this.body.velocity.y = -yVel
			}

			if (this.health > 0) {
				if (this.checkCenter % 45 == 0) {
					this.shootEightWay(this.scene, this)
					this.checkCenter = 0
				}
			}
		}
	}

	shootEightWay(scene, enemy) {
		if (this.health > 0) {
			let randomAngle = Math.random() * 2 * Math.PI

			for (
				let i = randomAngle;
				i <= 2 * Math.PI + randomAngle;
				i = i + Math.PI / 4
			) {
				let angle = i
				let rotation = {
					x: Math.cos(angle),
					y: Math.sin(angle),
				}
				const bossBulletLeft = new EnemyBullet(
					scene,
					enemy,
					-110,
					0,
					rotation,
					angle,
				)
				const enemyBulletRight = new EnemyBullet(
					scene,
					enemy,
					110,
					0,
					rotation,
					angle,
				)
			}
		}
	}
}

export default Boss
