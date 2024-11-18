class PlayerManager {
	constructor(scene, player, selectedPlayerIndex, roomNumber) {
		this.scene = scene
		this.player = player
		this.cursorKeys = scene.input.keyboard.createCursorKeys()
		// Add WASD keys
		this.wasdKeys = scene.input.keyboard.addKeys({
			up: 'W',
			down: 'S',
			left: 'A',
			right: 'D',
		})
		this.selectedPlayerIndex = selectedPlayerIndex
		this.roomNumber = roomNumber
		this.frameCounter = 0
	}

	healthPlayer() {
		this.frameCounter++
		// Check if one second has passed (60 frames)
		if (this.frameCounter >= 60) {
			this.player.health += this.player.healthGeneration * this.player.maxHealth
			this.frameCounter = 0 // Reset the counter
		}
	}

	movePlayer() {
		let xVelocity = 0
		let yVelocity = 0
		let animationKey = 'player_anim'

		// Check both cursorKeys and wasdKeys for movement
		if (this.cursorKeys.up.isDown || this.wasdKeys.up.isDown) {
			yVelocity = -this.player.speed
		} else if (this.cursorKeys.down.isDown || this.wasdKeys.down.isDown) {
			yVelocity = this.player.speed
		}

		if (this.cursorKeys.left.isDown || this.wasdKeys.left.isDown) {
			xVelocity = -this.player.speed
			animationKey = 'player_anim_left'
		} else if (this.cursorKeys.right.isDown || this.wasdKeys.right.isDown) {
			xVelocity = this.player.speed
			animationKey = 'player_anim_right'
		}

		// Diagonal movement
		if (this.cursorKeys.up.isDown || this.wasdKeys.up.isDown) {
			if (this.cursorKeys.left.isDown || this.wasdKeys.left.isDown) {
				// Diagonal movement: up + left
				xVelocity = -this.player.speed * 0.7071
				yVelocity = -this.player.speed * 0.7071
				animationKey = 'player_anim_left_diagonal'
			} else if (this.cursorKeys.right.isDown || this.wasdKeys.right.isDown) {
				// Diagonal movement: up + right
				xVelocity = this.player.speed * 0.7071
				yVelocity = -this.player.speed * 0.7071
				animationKey = 'player_anim_right_diagonal'
			}
		}

		if (this.cursorKeys.down.isDown || this.wasdKeys.down.isDown) {
			if (this.cursorKeys.left.isDown || this.wasdKeys.left.isDown) {
				// Diagonal movement: down + left
				xVelocity = -this.player.speed * 0.7071
				yVelocity = this.player.speed * 0.7071
				animationKey = 'player_anim_left_diagonal'
			} else if (this.cursorKeys.right.isDown || this.wasdKeys.right.isDown) {
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

	movePlayerPVP(socket) {
		let xVelocity = 0
		let yVelocity = 0
		let animationKey = `player_anim_${this.selectedPlayerIndex}`
		let opponentAnimationKey = `player_anim_${this.selectedPlayerIndex}`

		// Check for both arrow keys and WASD input
		if (this.cursorKeys.up.isDown || this.wasdKeys.up.isDown) {
			yVelocity = -this.player.speed
		} else if (this.cursorKeys.down.isDown || this.wasdKeys.down.isDown) {
			yVelocity = this.player.speed
		}

		if (this.cursorKeys.left.isDown || this.wasdKeys.left.isDown) {
			xVelocity = -this.player.speed
			animationKey = `player_anim_left_${this.selectedPlayerIndex}`
			opponentAnimationKey = `player_anim_right_${this.selectedPlayerIndex}`
		} else if (this.cursorKeys.right.isDown || this.wasdKeys.right.isDown) {
			xVelocity = this.player.speed
			animationKey = `player_anim_right_${this.selectedPlayerIndex}`
			opponentAnimationKey = `player_anim_left_${this.selectedPlayerIndex}`
		}

		// Handle diagonal movement for both input methods
		// Diagonal movement: up + left
		if (
			(this.cursorKeys.up.isDown || this.wasdKeys.up.isDown) &&
			(this.cursorKeys.left.isDown || this.wasdKeys.left.isDown)
		) {
			xVelocity = -this.player.speed * 0.7071
			yVelocity = -this.player.speed * 0.7071
			animationKey = `player_anim_left_diagonal_${this.selectedPlayerIndex}`
			opponentAnimationKey = `player_anim_right_diagonal_${this.selectedPlayerIndex}`
		}
		// Repeat for other diagonal directions...

		// Set velocities
		this.player.setVelocityX(xVelocity)
		this.player.setVelocityY(yVelocity)

		// Play animation based on the velocities
		if (this.player.anims.currentAnim.key !== animationKey) {
			this.player.play(animationKey)
			// Emit the current animation key to the server
			socket.emit('playerAnimation', {
				playerIndex: this.selectedPlayerIndex,
				animationKey: opponentAnimationKey,
				roomNumber: this.roomNumber,
			})
		}
	}
}

export default PlayerManager
