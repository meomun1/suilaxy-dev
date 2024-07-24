import Phaser from 'phaser'
import config from '../config/config.js'
import gameSettings from '../config/gameSettings.js'
import DamageNumber from './ui/DamageNumber.js'
import SoundManager from '../manager/SoundManager.js'
class Entity extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key, health) {
		super(scene, x, y, key)
		this.scene = scene
		this.health = health
		this.maxHealth = health
		this.setData('isDead', false)
		this.hpBarWidth = 20
		this.hpBarHeight = 5
		this.speed = 0
		this.SoundManager = new SoundManager(scene)

		this.scene.physics.world.enableBody(this, 0)
		this.scene.add.existing(this)
	}

	updateHealthBarPosition() {
		this.hpBar.x = this.x - this.hpBarWidth / 2
		if (this.hpBarWidth < 30) {
			this.hpBar.y = this.y + 30
		} else if (this.y >= config.height + 1000 || this.y < -1000) {
			this.hpBar.destroy()
			console.log('con co be be ')
		} else {
			this.hpBar.y = this.y + 120
		}
	}

	updateHealthBarValue(health, maxHealth) {
		if (this.health < 0) {
			this.hpBar.destroy()
		} else {
			this.hpBar.setValue(this.health, this.maxHealth)
		}
	}

	explode(canDestroy) {
		if (!this.getData('isDead')) {
			this.body.enable = false

			this.setTexture('explosion_texture')
			// if (this.scene.sys.game.globals.music.soundOn) {
			// this.scene.sound.play('explosionSound', { volume: 1 }); // Adjust volume as needed
			// }
			this.SoundManager.playExplosionSound()
			this.play('explosion_anim')

			if (this.shootTimer !== undefined) {
				if (this.shootTimer) {
					this.shootTimer.remove(false)
				}
			}

			this.setAngle(0)
			this.body.setVelocity(0, 0)

			this.on(
				'animationcomplete',
				function () {
					if (canDestroy) {
						this.destroy()
					} else {
						this.setVisible(false)
					}
				},
				this,
			)
			// this.scene.sfx.explosion.play();

			this.setData('isDead', true)
		}
	}

	setInteractiveEntity() {
		this.setInteractive()
	}

	setVelocityY(velocity) {
		if (velocity || velocity === 0) {
			this.body.velocity.y = velocity
		}
	}

	setVelocityX(velocity) {
		if (velocity || velocity === 0) {
			this.body.velocity.x = velocity
		}
	}

	setPhysics(scene) {
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		this.body.setCollideWorldBounds(true)
	}

	takeDamage(damage) {
		if (!this.getData('isDead')) {
			this.health -= damage
			new DamageNumber(this.scene, this.x, this.y, damage)

			// Check if the entity has a health bar before updating it
			if (this.updateHealthBarValue) {
				this.updateHealthBarValue()
			}

			if (this.health <= 0) {
				this.explode(true)
				// Check if the entity has a health bar before destroying it
				if (this.hpBar) {
					this.hpBar.destroy()
				}
			}
		}
	}
}

export default Entity
