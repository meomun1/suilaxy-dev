import Phaser from 'phaser'

class TestScene extends Phaser.Scene {
	constructor() {
		super('TestScene')
	}

	preload() {
		// Directly load the IPFS image using an HTML image element
		this.loadIPFSImage(
			'https://bafkreihi2dcwezvhjpp5omdja45nyo5d7wvbuyephar5owcifjemoy37bi.ipfs.nftstorage.link/',
			'ipfsWeapon',
		)
	}

	loadIPFSImage(url, key) {
		// Create an HTML image element to load the IPFS image
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = url

		// Once the image is loaded, add it as a texture in Phaser
		img.onload = () => {
			this.textures.addImage(key, img)
			this.createImage(key)
		}

		// Handle errors if the image fails to load
		img.onerror = (error) => {
			console.error('Failed to load image from IPFS:', error)
		}
	}

	createImage(key) {
		// Display the loaded IPFS image on the screen
		this.add.image(400, 300, key).setScale(0.5) // Adjust scale and position
	}

	create() {
		// You can add more elements or logic here if necessary
	}
}

export default TestScene
