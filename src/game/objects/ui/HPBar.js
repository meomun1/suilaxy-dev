import Phaser from 'phaser'

class HPBar extends Phaser.GameObjects.Container {
	constructor(scene, x, y, width, height, value, max) {
		super(scene, x, y)

		// Create the background bar
		this.backgroundBar = new Phaser.GameObjects.Graphics(scene)
		this.backgroundBar.fillStyle(0x000000, 0.5)
		this.backgroundBar.fillRect(0, 0, width, height)
		this.add(this.backgroundBar)

		// Create the foreground bar (HP bar)
		this.foregroundBar = new Phaser.GameObjects.Graphics(scene)
		this.foregroundBar.fillStyle(0xff0000, 1)
		this.foregroundBar.fillRect(0, 0, width, height)
		this.add(this.foregroundBar)

		// Set the initial value and max value
		this.setValue(value, max)

		// Add the container to the scene
		scene.add.existing(this)
	}

	setValue(value, max) {
		// Update the bar's foreground width based on the value
		this.foregroundBar.scaleX = value / max
	}
}

export default HPBar
