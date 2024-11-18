import Phaser from 'phaser'
import axios from 'axios'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import InterfaceManager from './InterfaceScene.js'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Collection identifiers for filtering
// const spaceshipCollectionIdentifiers = [
// 	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstFighter',
// ]

const weaponCollectionIdentifiers = [
	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstGun',
]

const fighterAssetsMapping = {
	1: 'Falcon',
	2: 'Eagle',
	3: 'Hawk',
	4: 'Vulture',
	5: 'Phoenix',
	6: 'Mockingbird',
	7: 'Raven',
	8: 'Condor',
	9: 'Albatross',
}

const mockSpaceshipNFTs = [
	{
		selectedPlayerIndex: 1,
		objectId: '0xspaceship01',
		name: 'Falcon',
		imageUrl: 'assets/nft-spaceships/plane_01.png',
	},
	{
		selectedPlayerIndex: 2,
		objectId: '0xspaceship02',
		name: 'Eagle',
		imageUrl: 'assets/nft-spaceships/plane_02.png',
	},
	{
		selectedPlayerIndex: 3,
		objectId: '0xspaceship03',
		name: 'Hawk',
		imageUrl: 'assets/nft-spaceships/plane_03.png',
	},
	{
		selectedPlayerIndex: 4,
		objectId: '0xspaceship04',
		name: 'Vulture',
		imageUrl: 'assets/nft-spaceships/plane_04.png',
	},
	{
		selectedPlayerIndex: 5,
		objectId: '0xspaceship05',
		name: 'Phoenix',
		imageUrl: 'assets/nft-spaceships/plane_05.png',
	},
	{
		selectedPlayerIndex: 6,
		objectId: '0xspaceship06',
		name: 'Mockingbird',
		imageUrl: 'assets/nft-spaceships/plane_06.png',
	},
	{
		selectedPlayerIndex: 7,
		objectId: '0xspaceship07',
		name: 'Raven',
		imageUrl: 'assets/nft-spaceships/plane_07.png',
	},
	{
		selectedPlayerIndex: 8,
		objectId: '0xspaceship08',
		name: 'Condor',
		imageUrl: 'assets/nft-spaceships/plane_08.png',
	},
	{
		selectedPlayerIndex: 9,
		objectId: '0xspaceship09',
		name: 'Albatross',
		imageUrl: 'assets/nft-spaceships/plane_09.png',
	},
]

class ChoosePlayer extends Phaser.Scene {
	constructor() {
		super('selectUtility')
		this.guiManager = new GuiManager(this)
		this.selectedTab = 'player_texture'
		this.selectedFighterName = '1' // Default fighter
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

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		// Preload fighter assets from mapping
		// Preload NFT images from mockSpaceshipNFTs
		mockSpaceshipNFTs.forEach((nft) => {
			this.load.image(nft.name, nft.imageUrl)
		})
	}

	async create() {
		this.cameras.main.fadeIn(1500)
		this.guiManager.createBackground('background')
		this.createSuilaxyTextAndLogo()

		// Initialize InterfaceManager
		this.interfaceManager = new InterfaceManager(this)

		// Load saved selection from localStorage
		this.loadSelection()

		// Show loading panel
		this.loadingPanel = this.add.image(
			config.width / 1.35,
			config.height / 2,
			'loading_panel',
		)
		this.loadingPanel.setVisible(true)

		// Create UI elements
		this.createTabs()
		this.createBackButton()
		this.createSaveButton()

		// Fetch spaceship NFTs (mocked)
		this.fighterDetails = await this.getMockSpaceshipNFTs()

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

		this.fighterPanel = this.createFighterSelectionPanel(
			config.width / 1.35,
			config.height / 2,
		).setVisible(true)
		this.weaponPanel = this.createWeaponSelectionPanel(
			config.width / 1.35,
			config.height / 2,
		).setVisible(true)

		this.updateWeaponPanel()
		this.updateTabDisplay()
	}

	// Mock function to simulate fetching spaceship NFTs
	async getMockSpaceshipNFTs() {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockSpaceshipNFTs), 1000)
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

		// Preselect "Falcon" as the default fighter
		this.fighterTabImage = this.add
			.image(
				fighterTab.x,
				fighterTab.y - 40,
				`player_texture_1`, // Default fighter is Falcon
			)
			.setScale(2)
			.setOrigin(0.5)
			.setVisible(true) // Show the fighter image initially for the default

		fighterTab.on('pointerdown', () => {
			this.selectedTab = 'player_texture'
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
		this.fighterPanel.setVisible(this.selectedTab === 'player_texture')
		this.weaponPanel.setVisible(this.selectedTab === 'weapon')
	}

	// Create a fighter selection panel (grid)
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
			const fighterName =
				this.fighterDetails[child.getData('index') - 1].selectedPlayerIndex
			this.selectedFighterName = fighterName
			this.fighterTabImage.setTexture(`player_texture_${fighterName}`)
			console.log('Fighter selected: ', fighterName)
		})

		return scrollablePanel
	}

	// Create grid for displaying fighters
	createGridForFighter(scene) {
		const itemCount = this.fighterDetails.length
		const itemsPerRow = 3
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

		// Loop through and add fighters dynamically to the grid
		for (let i = 0; i < itemCount; i++) {
			const fighter = this.fighterDetails[i]

			// Create the frame and center it
			const frame = scene.add
				.image(0, 0, 'slot_frame')
				.setOrigin(0.5) // Center the frame
				.setScale(1) // Adjust frame scale if needed

			// Create the fighter image, resize it to 96x96, and center it inside the frame
			const fighterImage = scene.add
				.image(0, 0, fighter.name)
				.setDisplaySize(125, 125)
				.setOrigin(0.5)

			// Add both the frame and the image to a label, so they are grouped together
			const item = scene.rexUI.add.label({
				width: 125,
				height: 125,
				background: frame,
				icon: fighterImage, // The image goes into the label's icon slot
				space: { icon: 10 },
			})

			item.setData('index', i + 1) // Set fighter index
			sizer.add(item) // Add the item to the grid
		}

		return sizer
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
				this.selectedFighterName,
				'Weapon selected:',
				this.selectedWeapon,
			)

			// Save selections to localStorage
			this.saveSelection(this.selectedFighterName, this.selectedWeapon)
			this.interfaceManager.goToMainMenu(0)
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
		gameSettings.selectedPlayerIndex = fighter
		gameSettings.selectedWeaponIndex = fighter // For tempo, use the same index for both
		console.log('Selections saved:', { fighter, weapon })
	}

	loadSelection() {
		const savedFighter = localStorage.getItem('selectedFighter')
		const savedWeapon = localStorage.getItem('selectedWeapon')
		if (savedFighter)
			this.selectedSpaceship = savedFighter ? parseInt(savedFighter, 10) : 1
		if (savedWeapon) this.selectedWeapon = parseInt(savedWeapon, 10)
	}
}

export default ChoosePlayer
