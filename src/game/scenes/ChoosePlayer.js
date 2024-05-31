import Phaser from 'phaser'
import config from '../config/config.js'
import gameSettings from '../config/gameSettings.js'
import { v4 as uuidv4 } from 'uuid'

class ChoosePlayer extends Phaser.Scene {
	constructor() {
		super('choosePlayer')
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

		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background',
		)

		this.background.setOrigin(0, 0)

		const chooseText = this.add.text(
			config.width / 2,
			config.height / 4 - 130,
			'CHOOSE YOUR SHIP!',
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '50px',
				color: '#F3F8FF', // Set the color for "SPACE"
				align: 'center',
			},
		)
		chooseText.setShadow(2, 2, '#F27CA4', 2, false, true)
		chooseText.setOrigin(0.5)

		let count = 1
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

		this.randomNFT()

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

		let url_img = this.randomNFT()

		this.scene.start('loadingScreen', { number: value, string: url_img })
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

	randomNFT() {
		const arrayFrame = [
			'Bronze',
			'Silver',
			'Gold',
			'Emerald',
			'Diamond',
			'Master',
			'Grandmaster',
			'Challenger',
			'Legendary',
		]

		const randomNum = Math.random() * 100

		let item
		let hashTag
		let url_img
		let description

		if (randomNum < 0.01) {
			url_img =
				'https://bafkreicelixacf7np74iu6rbdikstlr4x6rot73ilsuvrfk55crvmwkgre.ipfs.nftstorage.link/'
			item = arrayFrame[8] // 'legendary'
			hashTag = 9
			description =
				"Woven with the essence of legend, this Legendary Frame imbues the gun with an aura of myth and power. A coveted symbol of triumph, it signifies the collector's place among the NFT greats."
		} else if (randomNum < 0.1) {
			url_img =
				'https://bafkreickfhx57ajogrrixyvjwjmu6rzfhnllok7fexnlmb3gttcaxfhoxi.ipfs.nftstorage.link/'
			item = arrayFrame[7] // 'challenger'
			hashTag = 8
			description =
				"Forged in a Challenger Frame, this gun ignites the spirit of competition. Its dynamic design signifies the collector's unwavering pursuit of victory, a weapon for those who rise to the challenge."
		} else if (randomNum < 1) {
			url_img =
				'https://bafkreiecvcao5uukbc436dmghejpf2tepixwz6gfh46o2wblrhzyhlluqa.ipfs.nftstorage.link/'
			item = arrayFrame[6] // 'grandmaster'
			hashTag = 7
			description =
				"Crafted with a Grandmaster Frame, this weapon embodies unparalleled achievement. Its imposing presence reflects the collector's dominance in the NFT arena, a trophy for the elite."
		} else if (randomNum < 5) {
			url_img =
				'https://bafkreihi2dcwezvhjpp5omdja45nyo5d7wvbuyephar5owcifjemoy37bi.ipfs.nftstorage.link/'
			item = arrayFrame[5] // 'master'
			hashTag = 6
			description =
				"Enshrined in a Master Frame, this gun signifies superior skill and mastery. It’s a testament to the collector's dedication and expertise in the NFT realm."
		} else if (randomNum < 10) {
			url_img =
				'https://bafkreih6bgdgundl42sgnpdu3cgyzpeb5azqxzejfsw7rsfvsnmkc6dgqu.ipfs.nftstorage.link/'
			item = arrayFrame[4] // 'diamond'
			hashTag = 5
			description =
				'Framed with dazzling Diamonds, this gun is the epitome of elegance and excellence. Its unmatched brilliance makes it a coveted piece for discerning collectors.'
		} else if (randomNum < 20) {
			url_img =
				'https://bafkreid4t3haxbpqcya7nqybt2l64rkk4iterqgdkx4waa62nwmsobbjpm.ipfs.nftstorage.link/'
			item = arrayFrame[3] // 'emerald'
			hashTag = 4
			description =
				'Enveloped in a radiant Emerald Frame, this gun is a rare treasure. Its vibrant green hue signifies growth and vitality, making it a standout addition to any collection.'
		} else if (randomNum < 30) {
			url_img =
				'https://bafkreid5dhduya5ufjmgcgct7432wlluq7ew73o2colaazx2nsgdjyxi3i.ipfs.nftstorage.link/'
			item = arrayFrame[2] // 'gold'
			hashTag = 3
			description =
				'This magnificent gun is framed in Gold, representing wealth and prestige. A prized piece for any collector seeking to showcase their status and refined taste.'
		} else if (randomNum < 50) {
			url_img =
				'https://bafkreihi2dcwezvhjpp5omdja45nyo5d7wvbuyephar5owcifjemoy37bi.ipfs.nftstorage.link/'
			item = arrayFrame[1] // 'silver'
			hashTag = 2
			description =
				'Encased in a sleek Silver Frame, this gun exudes sophistication and precision. A step up from bronze, it’s perfect for collectors aiming to enhance their digital armory.'
		} else {
			url_img =
				'https://bafkreif7gnjzl6nfggk534zvkn6bkihr3zkf77p74cwic4ktnnb763uogu.ipfs.nftstorage.link/'
			item = arrayFrame[0] // 'bronze'
			hashTag = 1
			description =
				'This gun is encased in a Bronze Frame, a symbol of strength and resilience. A great starting point for collectors, it’s the foundation for building a powerful NFT arsenal.'
		}

		gameSettings.nft_id = uuidv4()
		gameSettings.nft_frame = item
		gameSettings.nft_weapon = 'Conqueror Blaster' + ' #' + hashTag
		gameSettings.nft_img_url = url_img
		gameSettings.nft_description = description

		return url_img
	}
}

export default ChoosePlayer
