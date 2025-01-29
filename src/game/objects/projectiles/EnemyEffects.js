import Entity from '../Entity.js'
import gameSettings from '../../config/gameSettings.js'
class EnemyEffect extends Entity {
	constructor(scene, x, y, effectName, enemy) {
		super(
			scene,
			x,
			y,
			`${effectName}_effect_texture`,
			`${effectName}_effect_anim`,
			1,
		)
		this.enemy = enemy
		this.scene = scene
		scene.add.existing(this)
		scene.projectilesEnemyEffects.add(this)

		this.setScale(1)

		this.setDepth(0)
	}

	update() {
		this.setY(this.enemy.y)
		this.setX(this.enemy.x)
	}
}

export default EnemyEffect
