import Phaser from 'phaser'
class HPBar2 extends Phaser.GameObjects.Container {
	constructor(scene, x, y, value, max) {
		super(scene, x, y)
		// Create the health bar (filled with red)
		this.foregroundBar = scene.add.rectangle(-80, -20, 185, 40, 0xd94055)
		this.foregroundBar.setOrigin(0)
		this.foregroundBar.setDepth(1)

		this.add(this.foregroundBar)

		// Create the health bar background
		this.backgroundBar = scene.add.image(0, 0, 'healthBar_texture')
		this.backgroundBar.setOrigin(0.5, 0.5)
		this.backgroundBar.setDepth(1)
		this.backgroundBar.setScale(1)

		this.add([this.backgroundBar, this.foregroundBar])

		this.setValue(value, max)

		// Add the container to the scene
		scene.add.existing(this)

		// Schedule a delayed additional check to ensure proper sync
		scene.time.delayedCall(100, () => {
			this.setValue(value, max)
		})
	}

	setValue(value, max) {
		// Ensure values are numbers and not null/undefined
		const safeValue = Number(value) || 0
		const safeMax = Number(max) || 1

		// Clamp the value between 0 and max
		const clampedValue = Math.min(Math.max(safeValue, 0), safeMax)

		// Calculate the scale
		const scale = clampedValue / safeMax

		// Update the bar width
		this.foregroundBar.scaleX = scale

		// Debug log
		// console.log('HPBar2 setValue:', { value: safeValue, max: safeMax, scale })
	}
}
export default HPBar2
