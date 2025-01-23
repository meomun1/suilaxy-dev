import Effect from '../objects/projectiles/Effect'
import gameSettings from '../config/gameSettings.js'
import Bug1 from '../objects/enemies/Bug1.js'
import Boss from '../objects/enemies/Boss.js'

class CollideManager {
	constructor(
		scene,
		player,
		enemies,
		healthPacks,
		shieldPacks,
		shield,
		soundManager,
	) {
		this.scene = scene
		this.player = player
		this.enemies = enemies
		this.healthPacks = healthPacks
		this.shieldPacks = shieldPacks
		this.shield = shield
		this.shieldActive = false
		this.soundManager = soundManager

		// add collision between effects and enemies
		this.scene.physics.add.overlap(
			this.scene.projectilesEffects,
			this.enemies,
			this.effectHitEnemy,
			null,
			this,
		)

		// Add collision between bullets and enemies
		this.scene.physics.add.overlap(
			this.scene.projectiles,
			this.enemies,
			this.bulletHitEnemy,
			null,
			this,
		)

		// Add collision between player having shield and enemies
		if (this.shield && this.enemies) {
			this.scene.physics.add.overlap(
				this.shield,
				this.enemies,
				this.shieldCollideEnemy,
				null,
				this,
			)
		}

		// Add collision between player having shield and bullet
		if (this.shield && this.scene.enemyProjectiles) {
			this.scene.physics.add.overlap(
				this.scene.enemyProjectiles,
				this.shield,
				this.shieldCollideBullet,
				null,
				this,
			)
		}

		// Add collision between enemy bullets and player
		this.scene.physics.add.overlap(
			this.scene.enemyProjectiles,
			this.player,
			this.bulletHitPlayer,
			null,
			this,
		)

		// Add collision between player and enemies
		this.scene.physics.add.overlap(
			this.player,
			this.enemies,
			this.playerHitEnemy,
			null,
			this,
		)

		// Add collision between player and health packs
		if (this.healthPacks) {
			this.healthPacks.forEach((healthPack) => {
				this.scene.physics.add.overlap(
					this.player,
					healthPack,
					this.playerCollideHealthPack,
					null,
					this,
				)
			})
		}

		// Add collision between player and shield packs
		if (this.shieldPacks) {
			this.shieldPacks.forEach((shieldPack) => {
				this.scene.physics.add.overlap(
					this.player,
					shieldPack,
					this.playerCollideShieldPack,
					null,
					this,
				)
			})
		}
	}

	// Shield collision with enemy
	shieldCollideEnemy(shield, enemy) {
		if (this.shieldActive) {
			enemy.takeDamage(100)
			shield.hide()
			this.shieldActive = false
		}
	}

	// Shield collision with bullet
	shieldCollideBullet(shield, enemyBullet) {
		if (this.shieldActive) {
			enemyBullet.destroy()
			shield.hide()
			this.shieldActive = false
		}
	}

	// Bullet collision with enemy
	bulletHitEnemy(enemy, bullet) {
		const currentTime = Date.now()

		// Initialize lastDamageTime if it doesn't exist
		if (!enemy.lastDamageTime) {
			enemy.lastDamageTime = 0
		}

		// Check if 0.5 seconds have passed since the last damage
		if (currentTime - enemy.lastDamageTime >= 500) {
			enemy.takeDamage(bullet.damage)
			enemy.lastDamageTime = currentTime
		}

		if (
			gameSettings.selectedPlayerIndex === 1 ||
			gameSettings.selectedPlayerIndex === 6 ||
			gameSettings.selectedPlayerIndex === 8
		) {
			return
		} else if (enemy instanceof Boss) {
			bullet.destroy()
			let effect = new Effect(this.scene, bullet.x, bullet.y, 1)
			effect.setTexture(`effect${gameSettings.selectedPlayerIndex}_texture`)
			effect.play(`effect${gameSettings.selectedPlayerIndex}_anim`)

			effect.on('animationcomplete', () => {
				effect.destroy()
			})

			return
		} else {
			bullet.destroy()
			let effect = new Effect(this.scene, bullet.x, bullet.y, 1)
			effect.setTexture(`effect${gameSettings.selectedPlayerIndex}_texture`)
			effect.play(`effect${gameSettings.selectedPlayerIndex}_anim`)

			// Pass the effect to the effectHitEnemy method
			this.effectHitEnemy(enemy, effect)

			effect.on('animationcomplete', () => {
				effect.destroy()
				// Remove the effect from the enemy when the animation completes
				enemy.setNotAffected()
				// Reset the enemy's velocity
			})
		}

		// Check for continued collision after 0.5 seconds
		setTimeout(() => {
			if (this.scene.physics.overlap(bullet, enemy)) {
				this.bulletHitEnemy(enemy, bullet)
			}
		}, 1000)
	}

	effectHitEnemy(enemy, effect) {
		if (
			!(enemy instanceof Boss) &&
			enemy &&
			effect &&
			!enemy.affectedStatus()
		) {
			// Check if the enemy is already affected by the effect
			enemy.setIsAffected()
			enemy.applyEffects(effect, gameSettings.selectedPlayerIndex)
		}
	}

	bulletHitPlayer(player, enemyBullet) {
		enemyBullet.destroy()
		const damageReduction = enemyBullet.damage * player.playerArmor * 0.1
		const finalDamage = enemyBullet.damage - damageReduction
		player.takeDamage(finalDamage)
	}

	playerHitEnemy(player, enemy) {
		const damageReduction = enemy.damage * player.playerArmor * 0.1
		const finalDamage = enemy.damage - damageReduction
		player.takeDamage(finalDamage)
		enemy.takeDamage(player.damage)
	}

	playerCollideHealthPack(player, healthPack) {
		this.soundManager.playHealthSound()
		const healthAmount = 400
		player.getHeal(healthAmount)
		healthPack.destroy()
	}

	playerCollideShieldPack(player, shieldPack) {
		this.soundManager.playShieldSound()
		shieldPack.destroy()
		this.shield.show()
		this.shieldActive = true
	}
}

export default CollideManager
