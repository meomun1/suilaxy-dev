import Phaser from 'phaser'

class MobileManager {
	constructor(scene) {
		this.scene = scene

		this.isMobile = !this.scene.sys.game.device.os.desktop

		if (this.isMobile) {
			this.createDraggablePlayer()
		}
	}

	createDraggablePlayer() {
		this.scene.input.on('drag', this.handlePlayerDrag, this)
	}

	handlePlayerDrag(pointer, gameObject, dragX, dragY) {
		this.scene.player.x = dragX
		this.scene.player.y = dragY

		this.scene.player.shootBullet(this.scene.selectedPlayerIndex)
	}
}

export default MobileManager
