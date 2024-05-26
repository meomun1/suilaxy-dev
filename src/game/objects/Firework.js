import Phaser from 'phaser'
class Firework extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'firework_texture') // Replace 'fireworkSprite' with your actual sprite key
		this.scene = scene
		this.scene.add.existing(this)
		this.scene.anims.create({
			key: 'fireworkMovement',
			frames: this.scene.anims.generateFrameNumbers('firework_texture', {
				start: 0,
				end: 12,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.play('fireworkMovement')
	}
}
export default Firework
