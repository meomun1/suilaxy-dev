import Phaser from 'phaser'
import config from '../../config/config.js'
import gameSettings from '../../config/gameSettings.js'
import GuiManager from '../../manager/GuiManager.js'
import { v4 as uuidv4 } from 'uuid'

class ChoosePlayerPVP extends Phaser.Scene {
	constructor() {
		super('choosePlayerPVP')
		this.guiManager = new GuiManager(this)
	}

	preload() {
		this.load.image(
			'background',
			'assets/images/backgrounds/purple/nebula_3.png',
		)

		this.load.image('under_player_hover', 'assets/gui/under_player_hover.png')

		for (let i = 1; i <= 9; i++) {
			this.load.spritesheet({
				key: `player_texture_${i}`,
				url: `assets/spritesheets/players/planes_0${i}A.png`,
				frameConfig: {
					frameWidth: 96,
					frameHeight: 96,
					startFrame: 0,
					endFrame: 19,
				},
			})
		}
	}

	create() {
		this.cameras.main.fadeIn(1500)
		this.guiManager.createBackground('background')

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		this.guiManager.createMediumText(
			config.width / 2,
			config.height / 4 - 130,
			'CHOOSE YOUR SHIP!',
			'Pixelify Sans',
			'50px',
			'#F3F8FF',
			'center',
			0.5,
		)

		// UNDER HOVER FOR PLAYER
		this.under_player = this.add.image(
			(config.width * 2) / 3 - config.width / 6,
			(config.height * 2) / 4 + 12,
			'under_player_hover',
		)

		// Set up a tween for blinking effect
		this.tweens.add({
			targets: this.under_player,
			alpha: 0.1, // Change the alpha value for blinking effect
			duration: 500, // Duration of each tween (in milliseconds)
			ease: 'Linear',
			repeat: -1, // -1 means repeat indefinitely
			yoyo: true, // Yoyo makes the tween reverse (fade in and out)
		})

		this.under_player.setVisible(false)
		this.under_player.setOrigin(0.5)
		this.under_player.setScale(2.2)
		this.under_player.setAlpha(0.9)

		// CREATE PLAYER IMAGES
		let count = 1
		for (let i = 1; i <= 3; i++) {
			for (let j = 1; j <= 3; j++) {
				const playerImage = this.add.image(
					(config.width * j) / 3 - config.width / 6,
					(config.height * i) / 4,
					`player_texture_${count}`,
					0,
				)
				playerImage.setOrigin(0.5)
				playerImage.setScale(2)
				playerImage.setInteractive()
				count = count + 1

				playerImage.on('pointerdown', () => {
					if (!this.playerSelected) {
						// If a player is not selected yet, update the under_player position
						this.under_player.x = playerImage.x
						this.under_player.y = playerImage.y + 12
						this.playerSelected = true
						this.selectedPlayerIndex = count
						this.under_player.setVisible(true)

						// Delay a bit then start the game
						this.time.delayedCall(
							1500,
							() => {
								this.enterPlayer()
							},
							null,
							this,
						)

						this.playerSelected = false
						this.selectedPlayerIndex = 0
					}
				})
			}
		}

		this.cursorKeys = this.input.keyboard.createCursorKeys()
		this.isKeyPressInProgess = false

		this.input.keyboard.on(
			'keydown',
			function (event) {
				if (event.code === 'Enter') {
					// Call a function to handle player selection
					this.enterPlayer()
				}
			},
			this,
		)

		// Create "LOGO" image
		// Create "LOGO" image
		const bottomLeftImage = this.add.image(
			(config.width / 10) * 8.5,
			(config.height / 10) * 9.78,
			'logo',
		)
		bottomLeftImage.setOrigin(0, 1)
		bottomLeftImage.setScale(0.3)

		this.hideTextInput()
	}

	update() {
		if (this.cursorKeys.up.isDown && !this.isKeyPressInProgess) {
			if (this.under_player.y == config.height / 4 + 12) {
				this.under_player.y = (config.height * 3) / 4 + 12
			} else {
				this.under_player.y = this.under_player.y - config.height / 4
			}
			this.isKeyPressInProgess = true
		} else if (this.cursorKeys.down.isDown && !this.isKeyPressInProgess) {
			if (this.under_player.y == (config.height * 3) / 4 + 12) {
				this.under_player.y = config.height / 4 + 12
			} else {
				this.under_player.y = this.under_player.y + config.height / 4
			}
			this.isKeyPressInProgess = true
		}

		if (this.cursorKeys.left.isDown && !this.isKeyPressInProgess) {
			if (this.under_player.x == config.width / 3 - config.width / 6) {
				this.under_player.x = config.width - config.width / 6
			} else {
				this.under_player.x = this.under_player.x - config.width / 3
			}
			this.isKeyPressInProgess = true
		} else if (this.cursorKeys.right.isDown && !this.isKeyPressInProgess) {
			if (this.under_player.x == config.width - config.width / 6) {
				this.under_player.x = config.width / 3 - config.width / 6
			} else {
				this.under_player.x = this.under_player.x + config.width / 3
			}
			this.isKeyPressInProgess = true
		}

		if (
			this.cursorKeys.up.isUp &&
			this.cursorKeys.down.isUp &&
			this.cursorKeys.left.isUp &&
			this.cursorKeys.right.isUp
		) {
			this.isKeyPressInProgess = false
		}
	}

	enterPlayer() {
		let value = this.getPlayerIndexByPosition(
			this.under_player.x,
			this.under_player.y,
		)

		this.scene.start('chooseRoom', { number: value })
	}

	getPlayerIndexByPosition(x, y) {
		if (y == config.height / 4 + 12) {
			if (x < (config.width * 2) / 3 - config.width / 6) {
				return 1
			} else if (x == (config.width * 2) / 3 - config.width / 6) {
				return 2
			} else {
				return 3
			}
		} else if (y == (config.height * 2) / 4 + 12) {
			if (x < (config.width * 2) / 3 - config.width / 6) {
				return 4
			} else if (x == (config.width * 2) / 3 - config.width / 6) {
				return 5
			} else {
				return 6
			}
		} else {
			if (x < (config.width * 2) / 3 - config.width / 6) {
				return 7
			} else if (x == (config.width * 2) / 3 - config.width / 6) {
				return 8
			} else {
				return 9
			}
		}
	}

	hideTextInput() {
		const playerNameInput = document.getElementById('playerNameInput')
		if (playerNameInput) {
			playerNameInput.style.display = 'none'
		}
	}
}

export default ChoosePlayerPVP
