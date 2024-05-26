class PlayerManager {
	constructor(scene, player, selectedPlayerIndex) {
		this.scene = scene
		this.player = player
		this.cursorKeys = scene.input.keyboard.createCursorKeys()
		this.selectedPlayerIndex = selectedPlayerIndex
	}

	movePlayer() {
		const currentTime = this.scene.time.now

		let xVelocity = 0
		let yVelocity = 0
		let animationKey = 'player_anim'

		if (this.cursorKeys.up.isDown) {
			yVelocity = -this.player.speed
		} else if (this.cursorKeys.down.isDown) {
			yVelocity = this.player.speed
		}

		if (this.cursorKeys.left.isDown) {
			xVelocity = -this.player.speed
			animationKey = 'player_anim_left'
		} else if (this.cursorKeys.right.isDown) {
			xVelocity = this.player.speed
			animationKey = 'player_anim_right'
		}

		// Diagonal movement
		if (this.cursorKeys.up.isDown) {
			if (this.cursorKeys.left.isDown) {
				// Diagonal movement: up + left
				xVelocity = -this.player.speed * 0.7071
				yVelocity = -this.player.speed * 0.7071
				animationKey = 'player_anim_left_diagonal'
			} else if (this.cursorKeys.right.isDown) {
				// Diagonal movement: up + right
				xVelocity = this.player.speed * 0.7071
				yVelocity = -this.player.speed * 0.7071
				animationKey = 'player_anim_right_diagonal'
			}
		}

		// Diagonal movement
		if (this.cursorKeys.down.isDown) {
			if (this.cursorKeys.left.isDown) {
				// Diagonal movement: down + left
				xVelocity = -this.player.speed * 0.7071
				yVelocity = this.player.speed * 0.7071
				animationKey = 'player_anim_left_diagonal'
			} else if (this.cursorKeys.right.isDown) {
				// Diagonal movement: down + right
				xVelocity = this.player.speed * 0.7071
				yVelocity = this.player.speed * 0.7071
				animationKey = 'player_anim_right_diagonal'
			}
		}

		// Set velocities
		this.player.setVelocityX(xVelocity)
		this.player.setVelocityY(yVelocity)

		// Play animation based on the velocities
		if (this.player.anims.currentAnim.key !== animationKey) {
			this.player.play(animationKey)
		}
	}
}

export default PlayerManager
