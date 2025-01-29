import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
class WingCover extends Entity {
	constructor(scene, number) {
		super(
			scene,
			scene.player.x,
			scene.player.y - 150,
			`effect${gameSettings.selectedPlayerIndex}_texture`,
			`effect${gameSettings.selectedPlayerIndex}_anim`,
			1,
		)
		this.scene = scene
		scene.add.existing(this)
		scene.physics.world.enableBody(this)
		scene.projectiles.add(this)
		this.damage = gameSettings.savePlayerBulletDamage

		this.setScale(0.4)
		this.setDisplaySize(165, 148)

		this.setDepth(0)

		this.destroying = true
	}

	update(player) {
		// console.log('WingCover update called')
		if (this.y < 0 || !this.active) {
			super.destroy()
		}
	}
}

export default WingCover
