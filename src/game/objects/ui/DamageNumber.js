import Phaser from 'phaser'

class DamageNumber extends Phaser.GameObjects.Text {
	constructor(scene, x, y, damage) {
		super(scene, x, y, damage.toString(), {
			fontFamily: 'Pixelify Sans',
			fontSize: 14,
			color: '#ff0000',
		})
		scene.add.existing(this)

		this.setDepth(2)

		// Tween for animation
		scene.tweens.add({
			targets: this,
			y: y - 20,
			alpha: 0,
			duration: 1000,
			ease: 'Linear',
			onComplete: () => {
				this.destroy()
			},
		})
	}
}

export default DamageNumber
