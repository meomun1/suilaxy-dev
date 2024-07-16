import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
import config from '../../config/config.js'
class PVPBulletPlayer extends Entity {
	constructor(scene, number, player) {
		super(
			scene,
			player.x,
			player.y - 10,
			`bullet${number}_texture`,
			`bullet${number}`,
			1,
		)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.pvpProjectiles1.add(this)

		this.body.velocity.y = -gameSettings.bulletSpeed

		this.damage = gameSettings.savePlayerBulletDamage

		this.bulletSize = player.bulletSize

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

export default PVPBulletPlayer
