import Phaser from 'phaser'
import config from '../config/config.js'
import gameSettings from '../config/gameSettings.js'
import { EventBus } from '../EventBus.js'

class NftScreen extends Phaser.Scene {
	constructor() {
		super('createNft')
		this.callingScene = 'createNft'
	}

	init() {}

	preload() {
		this.cameras.main.fadeIn(1000)

		this.load.image(
			'background',
			'assets/images/backgrounds/background_title.png',
		)
		this.load.image('pixel', 'assets/shaders/16x16.png')

		this.load.spritesheet({
			key: 'button_mint',
			url: 'assets/gui/button.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 4,
				endFrame: 4,
			},
		})
		this.load.spritesheet({
			key: 'button_mint_hover',
			url: 'assets/gui/button_hover.png',
			frameConfig: {
				frameWidth: 93,
				frameHeight: 28,
				startFrame: 4,
				endFrame: 4,
			},
		})
	}

	create() {
		// Create a black rectangle that covers the whole game
		let blackCover = this.add.rectangle(
			0,
			0,
			config.width,
			config.height,
			0x000000,
		)
		blackCover.setOrigin(0, 0)
		blackCover.setDepth(100)

		this.tweens.add({
			targets: blackCover,
			alpha: 0,
			duration: 2500,
			onComplete: function () {
				blackCover.destroy()
			},
		})

		// Create Background
		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background',
		)
		this.background.setOrigin(0, 0)

		// Create "SPACE" text
		const spaceText = this.add.text(
			config.width / 2,
			config.height / 2 - 200,
			'SUPER WARRIOR',
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '80px',
				color: '#F3F8FF',
				align: 'center',
			},
		)
		spaceText.setOrigin(0.5)
		spaceText.setShadow(3, 3, '#F27CA4', 2, false, true)

		const guardianText = this.add.text(
			config.width / 2,
			config.height / 2 - 100,
			'Claim your stellar prize',
			{
				fontFamily: 'Pixelify Sans',
				color: '#F3F8FF',
				fontSize: '45px',
				align: 'center',
			},
		)
		guardianText.setOrigin(0.5)
		guardianText.setShadow(3, 3, '#F27CA4', 2, false, true)

		// Tween animation for the rainbow effect on "GUARDIAN"
		this.tweens.add({
			targets: guardianText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})

		// Tween animation for the rainbow effect on "SPACE"
		this.tweens.add({
			targets: spaceText,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})

		this.meshRotation()

		EventBus.emit('current-scene-ready', {
			key: { callingScene: this.callingScene },
			nftProperties: {
				name: gameSettings.nft_weapon,
				frame: gameSettings.nft_frame,
				description: gameSettings.nft_description,
				url: gameSettings.nft_img_url,
			},
		})

		// Create a button for minting the NFT
		this.button_mint = this.add.sprite(
			config.width / 2,
			config.height / 2 + 320,
			'button_mint',
		)
		this.button_mint.setSize(93, 28)
		this.button_mint.setInteractive()

		this.button_mint.on('pointerover', () => {
			this.button_mint.setTexture('button_mint_hover')
		})

		this.button_mint.on('pointerout', () => {
			this.button_mint.setTexture('button_mint')
		})

		this.button_mint.on('pointerup', () => {
			EventBus.emit('mint-nft-clicked')
		})

		this.button_mint.setScale(1.5)
	}

	pixelTransformation() {
		// Pixel Transformation
		const source = this.textures.get('nft_texture').source[0].image
		console.log('hehe ', source)
		const canvas = this.textures.createCanvas('pad', 125, 125).source[0].image
		console.log('canva', canvas)
		const ctx = canvas.getContext('2d')

		ctx.drawImage(source, 0, 0, 125, 125)

		const imageData = ctx.getImageData(0, 0, 125, 125)

		let x = 0
		let y = 0
		const color = new Phaser.Display.Color()

		for (let i = 0; i < imageData.data.length; i += 4) {
			const r = imageData.data[i]
			const g = imageData.data[i + 1]
			const b = imageData.data[i + 2]
			const a = imageData.data[i + 3]

			if (a > 0) {
				const startX = Phaser.Math.Between(0, 1024)
				const startY = Phaser.Math.Between(0, 768)

				const dx = config.width / 2 - config.width / 4 + 25 + x * 2
				const dy = config.height / 2 - 10 + y * 2

				const image = this.add.image(startX, startY, 'pixel').setScale(0)

				color.setTo(r, g, b, a)

				image.setTint(color.color)

				this.tweens.add({
					targets: image,
					duration: 500,
					x: dx,
					y: dy,
					scaleX: 1,
					scaleY: 1,
					angle: 360,
					delay: i / 10,
					yoyo: true,
					repeat: -1,
					repeatDelay: 10000,
					hold: 10000,
				})
			}

			x++

			if (x === 125) {
				x = 0
				y++
			}
		}
	}

	meshRotation() {
		const mesh = this.add.mesh(
			config.width / 2,
			(config.height * 3) / 4 - config.height / 8,
			'nft_texture',
		)

		this.add.text(
			config.width / 2 -
				config.width / 8 -
				config.width / 16 +
				config.width / 32 +
				config.width / 64,
			(config.height * 15) / 16,
			'Rotate with mouse (Drag your nft)',
		)

		Phaser.Geom.Mesh.GenerateGridVerts({
			mesh,
			widthSegments: 6,
		})

		mesh.hideCCW = false

		mesh.panZ(5.5)

		const rotateRate = 1
		const panRate = 1
		const zoomRate = 4

		this.input.on('pointermove', (pointer) => {
			if (!pointer.isDown) {
				return
			}

			if (!pointer.event.shiftKey) {
				mesh.modelRotation.y += pointer.velocity.x * (rotateRate / 800)
				mesh.modelRotation.x += pointer.velocity.y * (rotateRate / 600)
			} else {
				mesh.panX(pointer.velocity.x * (panRate / 800))
				mesh.panY(pointer.velocity.y * (panRate / 600))
			}
		})

		this.input.on('wheel', (pointer, over, deltaX, deltaY, deltaZ) => {
			mesh.panZ(deltaY * (zoomRate / 600))
		})
	}
}

export default NftScreen
