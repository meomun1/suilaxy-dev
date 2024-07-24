import Entity from '../Entity'
import Bullet from '../projectiles/Bullet'
import PVPBulletPlayer from '../projectiles/PVPBulletPlayer'
import gameSettings from '../../config/gameSettings'
import HPBar2 from '../ui/HPBar2'
import SoundManager from '../../manager/SoundManager'
import PVPBulletOpponent from '../projectiles/PVPBulletOpponent'

class PVPPlayer extends Entity {
	constructor(scene, x, y, key, health) {
		super(scene, x, y, key, health)
		this.body.velocity.y = 0
		this.health = health
		this.maxHealth = health
		this.damage = 300
		this.bulletDamage = gameSettings.savePlayerBulletDamage
		this.speed = gameSettings.savePlayerSpeed

		this.shield = null
		this.setInteractiveEntity()
		this.setPhysics(scene)
		this.body.setSize(48, 48)
		this.setDepth(3)
		this.body.velocity.y = 0
		this.bulletSize = gameSettings.savePlayerBulletSize

		this.fireRate = gameSettings.savePlayerFireRate
		this.lastShootTime = 0
		this.lifestealRate = gameSettings.savePlayerLifesteal
		this.numberOfBullets = gameSettings.savePlayerNumberOfBullets
		this.bulletSpeed = gameSettings.savePlayerBulletSpeed
		this.selectedPlayer = 0

		this.SoundManager = new SoundManager(scene)

		this.hpBar = new HPBar2(
			scene,
			scene.sys.game.config.width - 485,
			scene.sys.game.config.height - 55,
			200,
			41,
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

	setInteractiveEntity() {
		if (this.scene.sys.game.device.os.desktop) {
			this.setInteractive({ draggable: false })
			return
		}

		this.setInteractive({ draggable: true })
		this.scene.input.setDraggable(this)

		this.on('drag', function (pointer, dragX, dragY) {
			this.x = dragX
			this.y = dragY

			this.shootBullet(this.selectedPlayer)
		})

		this.on('dragend', function (pointer) {
			// You can add code here to execute when the drag ends.
		})

		this.scene.input.on(
			'pointerup',
			function (pointer) {
				this.scene.input.setDragState(this, 0)
			},
			this,
		)
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

	savePlayer() {
		gameSettings.savePlayerSpeed = this.speed
		gameSettings.savePlayerBulletDamage = this.bulletDamage
		gameSettings.savePlayerLifesteal = this.lifestealRate
		gameSettings.savePlayerBulletSpeed = this.bulletSpeed
		gameSettings.savePlayerScore = gameSettings.playerScore
		gameSettings.savePlayerNumberOfBullets = this.numberOfBullets
		gameSettings.savePlayerFireRate = this.fireRate
		gameSettings.savePlayerDefaultBulletSize =
			gameSettings.playerDefaultBulletSize
		gameSettings.savePlayerBulletSize = this.bulletSize
		gameSettings.savePlayerMaxHealth = gameSettings.playerMaxHealth
		gameSettings.savePlayerUpgradeThreshold =
			gameSettings.playerUpgradeThreshold
	}

	restartToTile() {
		gameSettings.savePlayerSpeed = 300
		gameSettings.savePlayerBulletDamage = 500
		gameSettings.savePlayerLifesteal = 0
		gameSettings.savePlayerBulletSpeed = 400
		gameSettings.savePlayerScore = 0
		gameSettings.savePlayerNumberOfBullets = 1
		gameSettings.savePlayerFireRate = 700
		gameSettings.savePlayerDefaultBulletSize = 1.2
		gameSettings.savePlayerBulletSize = 1.2
		gameSettings.savePlayerUpgradeThreshold = 300
		this.restartGameSettings()
	}

	restartGameSettings() {
		gameSettings.playerSpeed = gameSettings.savePlayerSpeed
		gameSettings.playerBulletDamage = gameSettings.savePlayerBulletDamage
		gameSettings.playerLifesteal = gameSettings.savePlayerLifesteal
		gameSettings.playerBulletSpeed = gameSettings.savePlayerBulletSpeed
		gameSettings.playerScore = gameSettings.savePlayerScore
		gameSettings.playerNumberOfBullets = gameSettings.savePlayerNumberOfBullets
		gameSettings.playerFireRate = gameSettings.savePlayerFireRate
		gameSettings.playerDefaultBulletSize =
			gameSettings.savePlayerDefaultBulletSize
		gameSettings.playerBulletSize = gameSettings.savePlayerBulletSize
		gameSettings.playerUpgradeThreshold =
			gameSettings.savePlayerUpgradeThreshold
	}
}

export default PVPPlayer
