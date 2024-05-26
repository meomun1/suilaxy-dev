import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
class Bullet extends Entity {
	constructor(scene, number) {
		super(
			scene,
			scene.player.x,
			scene.player.y - 10,
			`bullet${number}_texture`,
			`bullet${number}`,
			1,
		)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.projectiles.add(this)

		this.body.velocity.y = -gameSettings.bulletSpeed

		this.damage = gameSettings.savePlayerBulletDamage

		this.bulletSize = scene.player.bulletSize

		this.setScale(this.bulletSize)

		this.setDepth(0)
	}

	update() {
		if (this.y < 20 || !this.active) {
			this.destroy()
		}
	}

	destroy() {
		// Call the parent destroy method if needed
		super.destroy()
	}
}

export default Bullet
