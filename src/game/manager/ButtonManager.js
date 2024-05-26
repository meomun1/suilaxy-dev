import config from '../config/config'

class ButtonManager {
	constructor(scene) {
		this.scene = scene

		this.button = this.scene.add.sprite(
			config.width - 20,
			30,
			'settingButton_texture',
		)

		this.button.setInteractive()

		this.button.on('pointerup', () => {
			config.pauseGame = !config.pauseGame
			if (config.pauseGame == true) {
				// this.button.play("pauseButton_anim");
				// this.button.play("resumeButton_anim");
				this.pause()
			} else {
				config.pauseGame = false
				// this.button.play("resumeButton_anim");
				// this.button.play("pauseButton_anim");
				this.resume()
			}
		})

		this.button.on('pointerover', () => {
			this.button.setTexture('settingHover_texture')
		})
		this.button.on('pointerout', () => {
			this.button.setTexture('settingButton_texture')
		})
	}

	toggleGamePause() {
		config.pauseGame = !config.pauseGame

		if (config.pauseGame === true) {
			this.button.play('pauseButton_anim')
			this.pauseGame()
		} else {
			config.pauseGame = false
			this.button.play('resumeButton_anim')
			this.resumeGame()
		}
	}

	pause() {
		// Pause the game logic or handle pausing
		// Show pause screen, etc.
		this.scene.scene.pause('playGame')
		this.scene.scene.launch('pauseScreen')
		// Code for animating the button to show as "resume"
	}

	resume() {
		// Resume the game logic or handle resuming
		this.scene.scene.resume('playGame')
		this.scene.scene.stop('pauseScreen')
		// Code for animating the button to show as "pause"
	}

	// }
}
export default ButtonManager
