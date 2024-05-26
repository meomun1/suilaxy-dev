import Entity from '../Entity'
import gameSettings from '../../config/gameSettings'
import HPBar from '../ui/HPBar'
import config from '../../config/config'

class Bug1 extends Entity {
	constructor(scene, x, y, health, scale = 1) {
		super(scene, x, y, 'bug1_texture', health)

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

	explode(canDestroy) {
		super.explode(canDestroy)
		this.scene.player.getHeal(this.scene.player.lifestealRate)
		if (this.y < config.height) {
			this.scene.UpgradeManager.updateScore(100)
		}
	}
}

export default Bug1
