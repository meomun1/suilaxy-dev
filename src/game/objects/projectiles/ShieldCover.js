import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'

class ShieldCover extends Entity {
	constructor(scene, number) {
		super(
			scene,
			scene.player.x,
			scene.player.y,
			`effect${gameSettings.selectedPlayerIndex}_texture`,
			`effect${gameSettings.selectedPlayerIndex}_anim`,
			1,
		)
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.projectiles.add(this) // Ensure this line is correct

		this.damage = gameSettings.savePlayerBulletDamage

		this.setScale(0.9)
		this.setDepth(0)
		this.destroying = false
	}

	update(player) {}

	destroyThis() {}
}

export default ShieldCover
