import Phaser from 'phaser'
import axios from 'axios'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Collection identifiers for filtering
// const spaceshipCollectionIdentifiers = [
// 	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstFighter',
// ]

const weaponCollectionIdentifiers = [
	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstGun',
]

// eslint-disable-next-line no-unused-vars
const fighterAssetsMapping = {
	Falcon: 'assets/spritesheets/players/planes_01A.png',
	Eagle: 'assets/spritesheets/players/planes_02A.png',
	Hawk: 'assets/spritesheets/players/planes_03A.png',
	Vulture: 'assets/spritesheets/players/planes_04A.png',
	Phoenix: 'assets/spritesheets/players/planes_05A.png',
	Mockingbird: 'assets/spritesheets/players/planes_06A.png',
	Raven: 'assets/spritesheets/players/planes_07A.png',
	Condor: 'assets/spritesheets/players/planes_08A.png',
	Albatross: 'assets/spritesheets/players/planes_09A.png',
}

const mockSpaceshipNFTs = [
	{
		objectId: '0xspaceship01',
		name: 'Falcon',
		imageUrl: 'assets/nft-spaceships/plane_01.png',
	},
	{
		objectId: '0xspaceship02',
		name: 'Eagle',
		imageUrl: 'assets/nft-spaceships/plane_02.png',
	},
	{
		objectId: '0xspaceship03',
		name: 'Hawk',
		imageUrl: 'assets/nft-spaceships/plane_03.png',
	},
	{
		objectId: '0xspaceship04',
		name: 'Vulture',
		imageUrl: 'assets/nft-spaceships/plane_04.png',
	},
	{
		objectId: '0xspaceship05',
		name: 'Phoenix',
		imageUrl: 'assets/nft-spaceships/plane_05.png',
	},
	{
		objectId: '0xspaceship06',
		name: 'Mockingbird',
		imageUrl: 'assets/nft-spaceships/plane_06.png',
	},
	{
		objectId: '0xspaceship07',
		name: 'Raven',
		imageUrl: 'assets/nft-spaceships/plane_07.png',
	},
	{
		objectId: '0xspaceship08',
		name: 'Condor',
		imageUrl: 'assets/nft-spaceships/plane_08.png',
	},
	{
		objectId: '0xspaceship09',
		name: 'Albatross',
		imageUrl: 'assets/nft-spaceships/plane_09.png',
	},
]

class ChoosePlayer extends Phaser.Scene {
	constructor() {
		super('selectUtility')
		this.guiManager = new GuiManager(this)
		this.selectedTab = 'fighter'
		this.selectedSpaceship = 1
		this.selectedWeapon = 1
		this.objectDetails = []
		this.fighterDetails = []
	}

	async preload() {
		this.load.scenePlugin(
			'rexuiplugin',
			'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
			'rexUI',
			'rexUI',
		)

		this.guiManager.loadImage('logo', 'assets/main-menu/logo.png')
		this.load.image('background', 'assets/main-menu/background.png')
		this.load.image('back_button', 'assets/gui/back-button.png')
		this.load.image('save_button', 'assets/gui/save-button.png')
		this.load.image('fighter_tab', 'assets/gui/fighter-tab.png')
		this.load.image('weapon_tab', 'assets/gui/weapon-tab.png')
		this.load.image('panel_background', 'assets/gui/panel-background.png')
		this.load.image('slot_frame', 'assets/gui/slot-frame.png')
		this.load.image('loading_panel', 'assets/gui/loading-panel.png')

		// Preload local fighters (These will be replaced with spaceship NFTs later)
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

	async create() {
		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)
		this.cameras.main.fadeIn(1500)

		this.guiManager.createBackground('background')
		this.createSuilaxyTextAndLogo()

		// Load saved selection from localStorage
		this.loadSelection()

		this.createTabs()

		// Create fixed-size panels and set their visibility to false initially
		this.fighterPanel = this.createFighterSelectionPanel(
			config.width / 1.35,
			config.height / 2,
		).setVisible(false)

		this.weaponPanel = this.createWeaponSelectionPanel(
			config.width / 1.35,
			config.height / 2,
		).setVisible(false)

		// Show a loading panel while fetching the data
		this.loadingPanel = this.add.image(
			config.width / 1.35,
			config.height / 2,
			'loading_panel',
		)
		this.loadingPanel.setVisible(true)

		// Fake fetching spaceship NFTs
		console.log('Simulating spaceship NFT fetch...')
		this.spaceshipDetails = await this.getMockSpaceshipNFTs()
		console.log('Spaceship NFTs loaded:', this.spaceshipDetails)

		// Only fetch weapons if they haven't been fetched before
		if (this.objectDetails.length === 0) {
			try {
				await this.getOwnedWeaponsAndDetails()
			} catch (error) {
				console.error('Error loading weapons from IPFS:', error)
			}
		} else {
			console.log('Weapons are already loaded.')
		}

		// Hide the loading panel and show the actual panels after loading completes
		this.loadingPanel.setVisible(false)
		this.fighterPanel.setVisible(true)
		this.weaponPanel.setVisible(true)

		this.updateWeaponPanel()
		this.updateTabDisplay()
		this.createBackButton()
		this.createSaveButton()
	}

	// Mock function to return spaceship NFTs (faked for development)
	async getMockSpaceshipNFTs() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(mockSpaceshipNFTs)
			}, 1000) // Simulate delay for fetching
		})
	}

	// Fetch the owned objects and weapon details
	async getOwnedWeaponsAndDetails() {
		const address =
			'0xf3818b7fc2702b188659042fa845efab12ed8a9e37bbad7b506d70cb4728e512'
		try {
			const response = await axios.post(SUI_RPC_URL, {
				jsonrpc: '2.0',
				id: 1,
				method: 'suix_getOwnedObjects',
				params: [
					address,
					{ showType: true, showOwner: true, showDisplay: true },
				],
			})

			if (response.data?.result?.data) {
				const ownedObjects = response.data.result.data

				// Clear objectDetails to avoid duplication
				this.objectDetails = []

				for (const obj of ownedObjects) {
					const objectId = obj?.data?.objectId
					if (objectId) {
						await this.getWeaponDetails(objectId)
					}
				}
			} else {
				console.log('No owned objects found.')
			}
		} catch (error) {
			console.error('Error fetching owned objects:', error)
		}
	}

	// Fetch the object details including the IPFS URL
	async getWeaponDetails(objectId) {
		try {
			const response = await axios.post(SUI_RPC_URL, {
				jsonrpc: '2.0',
				id: 1,
				method: 'sui_getObject',
				params: [
					objectId,
					{
						showType: true,
						showOwner: true,
						showPreviousTransaction: true,
						showDisplay: true,
						showContent: true,
					},
				],
			})

			const objectType = response.data?.result?.data?.type
			const content = response.data?.result?.data?.content?.fields
			const display = response.data?.result?.data?.display?.data

			// Check if the object type matches the collection identifiers
			if (objectType && weaponCollectionIdentifiers.includes(objectType)) {
				// Extract the image URL from display or content
				const imageUrl = display?.image_url || content?.url
				if (content && imageUrl) {
					this.objectDetails.push({ name: content.name, url: imageUrl })

					this.loadIPFSImage(
						imageUrl,
						`weapon_texture_${this.objectDetails.length}`,
					)
				} else {
					console.warn('No display or content URL found for object:', objectId)
				}
			} else {
				console.log(
					`Object ID: ${objectId} does not belong to the target collection.`,
				)
			}
		} catch (error) {
			console.error('Error fetching object details:', error)
		}
	}

	// Load images from IPFS and resize them to 96x96
	loadIPFSImage(url, key) {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = url

		img.onload = () => {
			const canvas = document.createElement('canvas')
			canvas.width = 96
			canvas.height = 96
			const ctx = canvas.getContext('2d')
			ctx.drawImage(img, 0, 0, 96, 96)
			const resizedImage = canvas.toDataURL()

			this.textures.addBase64(key, resizedImage)

			// Update the weapon tab with the loaded texture
			this.weaponTabImage.setTexture(key)
		}

		img.onerror = (error) => {
			console.error('Failed to load image from IPFS:', error)
		}
	}

	updateWeaponPanel() {
		this.weaponPanel?.destroy()
		this.weaponPanel = this.createWeaponSelectionPanel(
			config.width / 1.35,
			config.height / 2,
		)
		this.updateTabDisplay()
	}

	// Create the Suilaxy title and logo
	createSuilaxyTextAndLogo() {
		this.suilaxyText = this.add.text(
			config.width * 0.24,
			config.height * 0.1,
			'THE JOURNEY BEGINS',
			{
				fontFamily: 'Big Shoulders Stencil Display',
				color: '#FFFFFF',
				fontSize: '48px',
				fontStyle: 'bold',
				align: 'center',
			},
		)
		this.suilaxyText.setOrigin(0.5).setShadow(0, 0, '#FFD700', 6, true, true)
		this.logo = this.add.image(config.width * 0.01, config.width * 0.01, 'logo')
		this.logo.setOrigin(0, 0).setDepth(1)
	}

	// Create UI tabs
	createTabs() {
		const fighterTab = this.add.image(
			config.width / 7,
			config.height / 2,
			'fighter_tab',
		)
		fighterTab.setInteractive()

		this.fighterTabImage = this.add
			.image(
				fighterTab.x,
				fighterTab.y - 40,
				`player_texture_${this.selectedSpaceship}`,
			)
			.setScale(2)
			.setOrigin(0.5)

		fighterTab.on('pointerdown', () => {
			this.selectedTab = 'fighter'
			this.updateTabDisplay()
		})

		const weaponTab = this.add.image(
			config.width / 2.67,
			config.height / 2,
			'weapon_tab',
		)
		weaponTab.setInteractive()

		// Create default text and set it to visible by default
		this.defaultText = this.add.text(weaponTab.x, weaponTab.y - 30, 'DEFAULT', {
			fontFamily: 'Big Shoulders Stencil Display',
			fontSize: '48px',
			color: '#FFFFFF',
			fontStyle: 'bold',
			align: 'center',
		})
		this.defaultText.setOrigin(0.5).setShadow(0, 0, '#FFD700', 6, true, true)

		// Create the image for the weapon and set it invisible initially
		this.weaponTabImage = this.add
			.image(
				weaponTab.x,
				weaponTab.y - 30,
				`weapon_texture_1`, // Start with the first weapon or keep it hidden
			)
			.setScale(1.5)
			.setOrigin(0.5)
			.setVisible(false) // Hide the weapon image initially

		weaponTab.on('pointerdown', () => {
			this.selectedTab = 'weapon'
			this.updateTabDisplay()
		})
	}

	// Update the displayed panel based on selected tab
	updateTabDisplay() {
		if (this.selectedTab === 'fighter') {
			this.fighterPanel.setVisible(true)
			this.weaponPanel.setVisible(false)
		} else {
			this.fighterPanel.setVisible(false)
			this.weaponPanel.setVisible(true)
		}
	}

	// Create a fighter selection panel
	createFighterSelectionPanel(x, y) {
		const panelWidth = 448
		const panelHeight = 425
		const panelBackground = this.add
			.image(x, y, 'panel_background')
			.setDisplaySize(panelWidth, panelHeight)
			.setOrigin(0.5)

		const scrollablePanel = this.rexUI.add
			.scrollablePanel({
				x,
				y,
				width: panelWidth,
				height: panelHeight,
				scrollMode: 0,
				background: panelBackground,
				panel: {
					child: this.createGridForFighter(this),
					mask: { mask: true, padding: 1 },
				},
				mouseWheelScroller: { focus: false, speed: 0.1 },
				space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },
			})
			.layout()

		scrollablePanel.setChildrenInteractive().on('child.click', (child) => {
			this.selectedSpaceship = child.getData('index')
			this.fighterTabImage.setTexture(
				`player_texture_${this.selectedSpaceship}`,
			)
		})

		return scrollablePanel
	}

	// Create a weapon selection panel
	createWeaponSelectionPanel(x, y) {
		const panelWidth = 448
		const panelHeight = 425
		const panelBackground = this.add
			.image(x, y, 'panel_background')
			.setDisplaySize(panelWidth, panelHeight)
			.setOrigin(0.5)

		const scrollablePanel = this.rexUI.add
			.scrollablePanel({
				x,
				y,
				width: panelWidth,
				height: panelHeight,
				scrollMode: 0,
				background: panelBackground,
				panel: {
					child: this.createGridForWeapon(this),
					mask: { mask: true, padding: 1 },
				},
				mouseWheelScroller: { focus: false, speed: 0.1 },
				space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },
			})
			.layout()

		scrollablePanel.setChildrenInteractive().on('child.click', (child) => {
			const selectedWeaponIndex = child.getData('index')

			// Hide the default text and show the selected weapon image
			this.defaultText.setVisible(false)
			this.weaponTabImage.setVisible(true)
			this.weaponTabImage.setTexture(`weapon_texture_${selectedWeaponIndex}`)

			// Update selected weapon state
			this.selectedWeapon = selectedWeaponIndex
		})

		return scrollablePanel
	}

	// Create grid for displaying fighters
	createGridForFighter(scene) {
		const itemCount = 9 // Number of fighters
		const itemsPerRow = 3 // Number of items per row

		// Calculate the number of rows needed, at least 1 row
		const rows = itemCount > 0 ? Math.ceil(itemCount / itemsPerRow) : 1

		// Create a grid sizer with the calculated rows and fixed columns
		const sizer = scene.rexUI.add.gridSizer({
			column: itemsPerRow, // Fixed number of columns (3)
			row: rows, // Dynamically calculated number of rows
			space: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20,
				column: 10, // Space between columns
				row: 10, // Space between rows
			},
		})

		// Loop through and add each fighter to the grid
		for (let i = 0; i < itemCount; i++) {
			const itemKey = `player_texture_${i + 1}`

			const frame = scene.add
				.image(0, 0, 'slot_frame')
				.setScale(1)
				.setOrigin(0.5)

			const item = scene.rexUI.add.label({
				width: 60,
				height: 60,
				background: frame,
				icon: scene.add.image(0, 0, itemKey).setScale(1.3),
				space: { icon: 10 },
			})

			item.setData('index', i + 1) // Set fighter index
			sizer.add(item) // Add item to the grid
		}

		return sizer // Return the dynamically built grid
	}

	createGridForWeapon(scene) {
		const itemCount = this.objectDetails.length

		// Set the number of items per row
		const itemsPerRow = 3

		// If there are no items, set rows to 1 to avoid invalid grid size
		const rows = itemCount > 0 ? Math.ceil(itemCount / itemsPerRow) : 1

		const sizer = scene.rexUI.add.gridSizer({
			column: itemsPerRow, // Always 3 columns
			row: rows, // Dynamically calculated or at least 1 row
			space: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20,
				column: 10, // Space between columns
				row: 10, // Space between rows
			},
		})

		// Loop through and add weapons dynamically to the grid
		for (let i = 0; i < itemCount; i++) {
			const itemKey = `weapon_texture_${i + 1}`

			const frame = scene.add
				.image(0, 0, 'slot_frame')
				.setScale(1)
				.setOrigin(0.5)

			const item = scene.rexUI.add.label({
				width: 60,
				height: 60,
				background: frame,
				icon: scene.add.image(0, 0, itemKey).setScale(1.3),
				space: { icon: 10 },
			})

			item.setData('index', i + 1) // Set weapon index
			sizer.add(item) // Add item to the grid
		}

		return sizer // Return the dynamically built grid
	}

	createBackButton() {
		const backButton = this.add.image(
			config.width / 7,
			config.height / 1.15,
			'back_button',
		)
		backButton.setInteractive()

		backButton.on('pointerdown', () => {
			this.scene.start('mainMenu')
		})

		backButton.on('pointerover', () => {
			backButton.setScale(1.05)
		})

		backButton.on('pointerout', () => {
			backButton.setScale(1)
		})
	}

	// Create save button
	createSaveButton() {
		const saveButton = this.add.image(
			config.width / 2.67,
			config.height / 1.15,
			'save_button',
		)
		saveButton.setInteractive()

		saveButton.on('pointerdown', () => {
			console.log(
				'Spaceship (Fighter) selected:',
				this.selectedSpaceship,
				'Weapon selected:',
				this.selectedWeapon,
			)

			// Save selections to localStorage
			this.saveSelection(this.selectedSpaceship, this.selectedWeapon)
		})

		saveButton.on('pointerover', () => {
			saveButton.setScale(1.05)
		})

		saveButton.on('pointerout', () => {
			saveButton.setScale(1)
		})
	}

	saveSelection(fighter, weapon) {
		localStorage.setItem('selectedFighter', fighter)
		localStorage.setItem('selectedWeapon', weapon)
		console.log('Selections saved:', { fighter, weapon })
	}

	loadSelection() {
		const savedFighter = localStorage.getItem('selectedFighter')
		const savedWeapon = localStorage.getItem('selectedWeapon')
		if (savedFighter) this.selectedSpaceship = parseInt(savedFighter, 10)
		if (savedWeapon) this.selectedWeapon = parseInt(savedWeapon, 10)
	}
}

export default ChoosePlayer
