import Entity from '../Entity'
import Bullet from '../projectiles/Bullet'
import PVPBulletPlayer from '../projectiles/PVPBulletPlayer'
import gameSettings from '../../config/gameSettings'
import HPBar2 from '../ui/HPBar2'
import SoundManager from '../../manager/SoundManager'
import PVPBulletOpponent from '../projectiles/PVPBulletOpponent'
import config from '../../config/config'
import ShieldCover from '../projectiles/ShieldCover'
import WingCover from '../projectiles/WingCover'
import RandomBullet from '../projectiles/RandomBullet'

class Player extends Entity {
	constructor(scene, x, y, key, health) {
		super(scene, x, y, key, health)

		this.body.velocity.x = 0
		this.body.velocity.y = 0
		this.health = health
		this.maxHealth = health
		this.damage = 300
		this.lastShootTime = 0
		this.lastWingTime = 0
		this.lastShieldTime = 0
		this.shield = null
		this.setInteractiveEntity()
		this.setPhysics(scene)
		this.setScale(gameSettings.savePlayerSize)
		this.setDepth(3)

		this.speed = gameSettings.savePlayerSpeed
		this.bulletDamage = gameSettings.savePlayerBulletDamage
		this.lifestealRate = gameSettings.savePlayerLifesteal
		this.bulletSpeed = gameSettings.savePlayerBulletSpeed
		this.numberOfBullets = gameSettings.savePlayerNumberOfBullets
		this.fireRate = gameSettings.savePlayerFireRate
		this.bulletSize = gameSettings.savePlayerBulletSize
		this.playerSize = gameSettings.savePlayerSize
		this.playerArmor = gameSettings.savePlayerArmor
		this.healthGeneration = gameSettings.savePlayerHealthGeneration
		this.playerBuffRate = gameSettings.savePlayerBuffRate

		this.SoundManager = new SoundManager(scene)

		this.hpBar = new HPBar2(
			scene,
			config.width / 9,
			config.height - config.height / 16,
			this.health,
			this.maxHealth,
		)
		this.scene.add.existing(this.hpBar)
		this.key = key

		this.setDepth(1)
	}

	setVelocityY(velocity) {
		super.setVelocityY(velocity)
	}

	setVelocityX(velocity) {
		super.setVelocityX(velocity)
	}

	explode(canDestroy) {
		super.explode(canDestroy)
	}

	shootBullet(number, player, check) {
		const currentTime = this.scene.time.now
		const elapsedTime = currentTime - this.lastShootTime

		if (elapsedTime > this.fireRate) {
			this.lastShootTime = currentTime

			let totalBullets = this.numberOfBullets

			// Define patterns for 3, 4, and 5 bullets
			const patternsX = {
				1: [0], // Pattern for 1 bullet
				2: [-15, 15], // Pattern for 2 bullets
				3: [-15, 0, 15], // Pattern for 3 bullets
				4: [-30, -15, 15, 30], // Pattern for 4 bullets
				5: [-30, -15, 0, 15, 30], // Pattern for 5 bullets
				6: [-45, -30, -15, 15, 30, 45], // Pattern for 6 bullets
				7: [-45, -30, -15, 0, 15, 30, 45], // Pattern for 7 bullets
				8: [-45, -30, -15, 0, 15, 30, 45, 60], // Pattern for 8 bullets
				9: [-45, -30, -15, 0, 15, 30, 45, 60, 75], // Pattern for 9 bullets
				10: [-45, -30, -15, 0, 15, 30, 45, 60, 75, 90], // Pattern for 10 bullets
			}

			const patternsY = {
				1: [0], // Pattern for 1 bullet
				2: [0, 0], // Pattern for 2 bullets
				3: [0, -25, 0], // Pattern for 3 bullets
				4: [0, -25, -25, 0], // Pattern for 4 bullets
				5: [0, -25, -50, -25, 0], // Pattern for 5 bullets
				6: [0, -25, -50, -50, -25, 0], // Pattern for 6 bullets
				7: [0, -25, -50, -75, -50, -25, 0], // Pattern for 7 bullets
				8: [0, -25, -50, -75, -75, -50, -25, 0], // Pattern for 8 bullets
				9: [0, -25, -50, -75, -100, -75, -50, -25, 0], // Pattern for 9 bullets
				10: [0, -25, -50, -75, -100, -100, -75, -50, -25, 0], // Pattern for 10 bullets
			}

			const bulletSizeScale =
				(this.bulletSize / gameSettings.savePlayerDefaultBulletSize) * 0.8

			for (let i = 0; i < totalBullets; i++) {
				const offsetX = (patternsX[totalBullets][i] || 0) * bulletSizeScale
				const offsetY = (patternsY[totalBullets][i] || 0) * bulletSizeScale

				let bullet = null

				if (player && check) {
					bullet = new PVPBulletPlayer(this.scene, number, player)
					bullet.body.velocity.y = -this.bulletSpeed
				} else if (player && !check) {
					bullet = new PVPBulletOpponent(this.scene, number, player)
					bullet.body.velocity.y = this.bulletSpeed
				} else {
					bullet = new Bullet(this.scene, number)
					bullet.body.velocity.y = -this.bulletSpeed
				}

				if (bullet) {
					bullet.damage = this.bulletDamage
					bullet.setPosition(this.x + offsetX, this.y + offsetY)
					bullet.play(`bullet${number}_anim`)
				}

				if (check === 0) {
					bullet.flipY = true
				}
			}
			this.SoundManager.playBulletSound()
		}
	}

	createShield(player) {
		const currentTime = this.scene.time.now
		const elapsedTime = currentTime - this.lastShieldTime

		if (elapsedTime > this.fireRate * 1.5) {
			this.lastShieldTime = currentTime

			if (player) {
				let shield = new ShieldCover(this.scene, 1)
				shield.setTexture(`effect${gameSettings.selectedPlayerIndex}_texture`)
				shield.play(`effect${gameSettings.selectedPlayerIndex}_anim`)
				shield.damage = gameSettings.savePlayerBulletDamage

				// Listen for the animation complete event to destroy the shield
				shield.on('animationcomplete', () => {
					shield.destroy()
				})
			}
		}
	}

	createWing(player) {
		const currentTime = this.scene.time.now
		const elapsedTime = currentTime - this.lastWingTime

		if (elapsedTime > this.fireRate) {
			this.lastWingTime = currentTime

			if (player) {
				let wing = new WingCover(this.scene, 1)
				wing.setTexture(`effect${gameSettings.selectedPlayerIndex}_texture`)
				wing.play(`effect${gameSettings.selectedPlayerIndex}_anim`)
				wing.damage = gameSettings.savePlayerBulletDamage

				wing.on('animationcomplete', () => {
					wing.destroy()
				})
			}
		}
	}

	createRandomBullet(player) {
		const currentTime = this.scene.time.now
		const elapsedTime = currentTime - this.lastShootTime

		if (elapsedTime > this.fireRate / 1.25) {
			this.lastShootTime = currentTime

			if (player) {
				let bullet = new RandomBullet(this.scene, 1)
				bullet.setTexture(`effect${gameSettings.selectedPlayerIndex}_texture`)
				bullet.play(`effect${gameSettings.selectedPlayerIndex}_anim`)
				bullet.damage = gameSettings.savePlayerBulletDamage

				bullet.on('animationcomplete', () => {
					bullet.destroy()
				})
			}
		}
	}

	setPhysics(scene) {
		super.setPhysics(scene)
	}

	getHeal(heal) {
		if (this.health + heal > this.maxHealth) {
			this.health = this.maxHealth
		} else if (this.health < this.maxHealth) {
			this.health += heal
		}
		this.updateHealthBarValue()
	}

	getCurrentHealth() {
		return this.health
	}
}

export default Player
