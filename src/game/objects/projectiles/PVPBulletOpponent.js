import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
import config from '../../config/config.js'
class PVPBulletOpponent extends Entity {
	constructor(scene, number, opponent) {
		super(
			scene,
			opponent.x,
			opponent.y - 10,
			`bullet${number}_texture`,
			`bullet${number}`,
			1,
		)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.pvpProjectiles2.add(this)

		// this.body.velocity.y = gameSettings.bulletSpeed

		this.damage = gameSettings.savePlayerBulletDamage

		this.bulletSize = opponent.bulletSize

		this.setScale(this.bulletSize)

		this.setDepth(0)
	}

	update() {
		if (this.y < 20 || !this.active || this.y > config.height - 20) {
			this.destroy()
		}
	}

	destroy() {
		// Call the parent destroy method if needed
		super.destroy()
	}
}

export default PVPBulletOpponent
