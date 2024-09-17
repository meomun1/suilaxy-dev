import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
import config from '../../config/config.js'

class RandomBullet extends Entity {
	constructor(scene, number) {
		const randomX = Math.random() * (config.width * 0.8) + config.width * 0.1
		const randomY = Math.random() * (config.height * 0.8) + config.height * 0.1

		super(
			scene,
			randomX,
			randomY,
			`effect${gameSettings.selectedPlayerIndex}_texture`,
			`effect${gameSettings.selectedPlayerIndex}_anim`,
			1,
		)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.projectiles.add(this)

		this.damage = gameSettings.savePlayerBulletDamage

		this.setScale(2)
		this.setDepth(0)
		this.destroying = false
	}

	update(player) {
		if (this.y < 0 || !this.active) {
			super.destroy()
		}
	}

	destroyThis() {
		console.log('Bullet destroy called')
		if (this.destroying) {
			return
		}
		this.destroying = true
	}
}

export default RandomBullet
