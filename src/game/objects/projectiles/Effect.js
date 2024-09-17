import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
class Effect extends Entity {
	constructor(scene, x, y, number) {
		super(
			scene,
			x,
			y,
			`effect${gameSettings.selectedPlayerIndex}_texture`,
			`effect${gameSettings.selectedPlayerIndex}_anim`,
			1,
		)
		this.scene = scene
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.projectilesEffects.add(this)
		this.damage = gameSettings.savePlayerBulletDamage

		if (gameSettings.selectedPlayerIndex === 9) {
			this.setScale(0.5)
		} else {
			this.setScale(1.5)
		}

		this.setDepth(0)
	}

	update(player) {}
}

export default Effect
