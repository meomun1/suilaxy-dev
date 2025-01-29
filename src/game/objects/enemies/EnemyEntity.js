import gameSettings from '../../config/gameSettings.js'
import Entity from '../Entity.js'
import EnemyEffect from '../projectiles/EnemyEffects.js'

class EnemyEntity extends Entity {
	constructor(scene, x, y, key, health) {
		super(scene, x, y, key)

		this.isAffected = false
		this.count = 0
	}

	setIsAffected() {
		this.isAffected = true
	}

	setNotAffected() {
		this.isAffected = false
	}

	affectedStatus() {
		return this.isAffected
	}

	applyEffects(effect, playerIndex) {
		switch (playerIndex) {
			case 2:
				this.blackHoleCollideEnemy(effect, this)
				break
			case 3:
				this.timeBubbleCollideEnemy(effect, this)
				break
			case 4:
				this.areaDamageCollideEnemy(effect, this)
				break
			case 5:
				this.electricFieldCollideEnemy(effect, this)
				break
			case 7:
				this.bounceBulletCollideEnemy(effect, this)
				break
			case 9:
				this.toxicGasCollideEnemy(effect, this)
				break
			default:
				break
		}
	}

	blackHoleCollideEnemy(effect, enemy) {
		const damagePerTick = 50 // Small damage per tick
		const moveSpeed = gameSettings.enemySpeed / 4 // Speed at which the enemy moves towards the center of the effect

		// Calculate the direction vector from the enemy to the center of the effect
		const directionX = effect.x - enemy.x
		const directionY = effect.y - enemy.y

		// Normalize the direction vector
		const magnitude = Math.sqrt(
			directionX * directionX + directionY * directionY,
		)

		let effectRadius = magnitude

		const normalizedDirectionX = directionX / magnitude
		const normalizedDirectionY = directionY / magnitude

		// Apply velocity to the enemy
		if (enemy.body) {
			enemy.body.setVelocity(
				normalizedDirectionX * moveSpeed,
				normalizedDirectionY * moveSpeed,
			)
		} else {
			console.error('Enemy does not have a physics body')
		}

		// Apply continuous small damage
		const duration = 1500 // Duration of the effect in milliseconds (e.g., 5000ms = 5 seconds)

		const damageEvent = this.scene.time.addEvent({
			delay: 300, // Damage interval in milliseconds
			callback: () => {
				// Calculate the distance between the enemy and the center of the effect
				const distanceX = effect.x - enemy.x
				const distanceY = effect.y - enemy.y
				const distance = Math.sqrt(
					distanceX * distanceX + distanceY * distanceY,
				)

				// Check if the enemy is still within the effect area
				if (distance > effectRadius || enemy.health <= 0) {
					// Stop the effect if the enemy is out of the effect area or dead
					damageEvent.remove(false)
					return
				}

				enemy.takeDamage(damagePerTick)
			},
			callbackScope: this,
			loop: true,
		})

		// Remove the damageEvent after the specified duration
		this.scene.time.delayedCall(
			duration,
			() => {
				damageEvent.remove(false)
				if (enemy.health > 0) {
					enemy.setVelocityY(gameSettings.enemySpeed / 2)
				}
			},
			[],
			this,
		)
	}

	timeBubbleCollideEnemy(effect, enemy) {
		// Set the enemy's y-velocity to 0 or move backward
		if (enemy.health > 0) {
			let timeEffect = new EnemyEffect(
				this.scene,
				enemy.x,
				enemy.y,
				'time',
				enemy,
			)
			timeEffect.setTexture('time_effect_texture')
			timeEffect.play('time_effect_anim')
			timeEffect.on('animationcomplete', () => {
				timeEffect.destroy()
			})
		}

		if (enemy.body) {
			enemy.setVelocityY(-gameSettings.enemySpeed / 3)

			// Start rotating the enemy
			enemy.rotationTween = this.scene.tweens.add({
				targets: enemy,
				angle: 360,
				duration: 1500,
				repeat: -1,
			})
		} else {
			console.error('Enemy does not have a physics body')
		}

		// Restore the enemy's y-velocity after 1500 milliseconds
		this.scene.time.delayedCall(
			1500,
			() => {
				if (enemy.health > 0) {
					if (enemy.rotationTween) {
						enemy.rotationTween.stop()
						enemy.rotationTween = null
						enemy.angle = 0 // Reset the angle
					}
					enemy.setVelocityY(gameSettings.enemySpeed / 2)
				}
			},
			[],
			this,
		)
	}

	areaDamageCollideEnemy(effect, enemy) {
		// Apply damage to the enemy
		enemy.takeDamage(effect.damage / 2)
	}

	electricFieldCollideEnemy(effect, enemy) {
		// Chain lightning logic
		this.chainLightningEffect(enemy, effect, 2, 200) // Example values for maxChains and chainRange
	}

	electricFieldCollideEnemy(effect, enemy) {
		enemy.takeDamage(enemy.maxHealth / 3)
		if (enemy.health > 0) {
			let electricEffect = new EnemyEffect(
				this.scene,
				enemy.x,
				enemy.y,
				'electric',
				enemy,
			)
			electricEffect.setTexture('electric_effect_texture')
			electricEffect.play('electric_effect_anim')
			electricEffect.on('animationcomplete', () => {
				electricEffect.destroy()
			})
		}
		// Chain lightning logic
		this.chainLightningEffect(enemy, effect, 2, 200) // Example values for maxChains and chainRange
	}

	chainLightningEffect(initialEnemy, effect, maxChains, chainRange) {
		// Helper function to find nearby enemies
		const findNearbyEnemies = (currentEnemy, range) => {
			if (!this.scene.EnemyManager || !this.scene.EnemyManager.enemies) {
				console.error('EnemyManager or enemies not defined')
				return []
			}

			return this.scene.EnemyManager.enemies.filter((e) => {
				const distance = Math.sqrt(
					Math.pow(e.x - currentEnemy.x, 2) + Math.pow(e.y - currentEnemy.y, 2),
				)
				return distance <= range && e !== currentEnemy
			})
		}

		// Set to track affected enemies
		const affectedEnemies = new Set()

		// Recursive function to chain the lightning effect
		const chainLightning = (currentEnemy, remainingChains) => {
			if (remainingChains <= 0) return

			const nearbyEnemies = findNearbyEnemies(currentEnemy, chainRange)
				.sort((a, b) => {
					const distanceA = Math.sqrt(
						Math.pow(a.x - currentEnemy.x, 2) +
							Math.pow(a.y - currentEnemy.y, 2),
					)
					const distanceB = Math.sqrt(
						Math.pow(b.x - currentEnemy.x, 2) +
							Math.pow(b.y - currentEnemy.y, 2),
					)
					return distanceA - distanceB
				})
				.slice(0, 2) // Get the two nearest enemies

			nearbyEnemies.forEach((ne) => {
				if (ne.health <= 0 || affectedEnemies.has(ne)) return

				if (ne.health > 0) {
					let electricEffect = new EnemyEffect(
						this.scene,
						ne.x,
						ne.y,
						'electric',
						ne,
					)
					electricEffect.setTexture('electric_effect_texture')
					electricEffect.play('electric_effect_anim')
					electricEffect.on('animationcomplete', () => {
						electricEffect.destroy()
					})
				}

				ne.takeDamage(ne.maxHealth / 3)
				affectedEnemies.add(ne)

				chainLightning(ne, remainingChains - 1)
			})
		}

		// Start the chain lightning effect
		affectedEnemies.add(initialEnemy)
		chainLightning(initialEnemy, maxChains)
	}

	bounceBulletCollideEnemy(effect, enemy) {
		if (enemy.body) {
			if (enemy.health <= 0) return
			let bounceEffect = new EnemyEffect(
				this.scene,
				enemy.x,
				enemy.y,
				'bounce',
				enemy,
			)
			bounceEffect.setTexture('bounce_effect_texture')
			bounceEffect.play('bounce_effect_anim')
			bounceEffect.on('animationcomplete', () => {
				bounceEffect.destroy()
			})

			// Calculate the direction vector from the effect to the enemy
			const directionX = enemy.x - effect.x
			const directionY = enemy.y - effect.y

			// Normalize the direction vector
			const magnitude = Math.sqrt(
				directionX * directionX + directionY * directionY,
			)
			const normalizedDirectionX = directionX / magnitude
			const normalizedDirectionY = directionY / magnitude

			// Apply initial push to the enemy
			const pushForce = 200 // Adjust the force as needed
			enemy.body.setVelocity(
				normalizedDirectionX * pushForce,
				normalizedDirectionY * pushForce,
			)

			// Restore the enemy's velocity after a short duration
			const duration = 400 // Duration of the push effect in milliseconds
			this.scene.time.delayedCall(
				duration,
				() => {
					if (enemy.health > 0) {
						enemy.setVelocityY(gameSettings.enemySpeed / 2)
						enemy.setVelocityX(0)
					}
				},
				[],
				this,
			)
		} else {
			console.error('Enemy does not have a physics body')
		}
	}

	toxicGasCollideEnemy(effect, enemy) {
		console.log('Toxic Gas effect applied to the')
		if (enemy.health <= 0) return
		let gasEffect = new EnemyEffect(
			this.scene,
			enemy.x,
			enemy.y,
			'poison',
			enemy,
		)
		gasEffect.setTexture('poison_effect_texture')
		gasEffect.play('poison_effect_anim')
		gasEffect.on('animationcomplete', () => {
			gasEffect.destroy()
		})
		// Apply continuous small damage
		const damagePerTick = 50 // Small damage per tick
		const healthPercentage = (enemy.health * 2) / 10

		const damageEvent = this.scene.time.addEvent({
			delay: 350, // Damage interval in milliseconds
			callback: () => {
				// Check if the enemy is still within the effect area
				if (enemy.health < healthPercentage) {
					// Stop the effect if the enemy is out of the effect area or dead
					damageEvent.remove(false)
					return
				}

				enemy.takeDamage(damagePerTick)
			},
			callbackScope: this,
			loop: true,
		})
	}
}

export default EnemyEntity
