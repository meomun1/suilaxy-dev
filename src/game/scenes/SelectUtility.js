import Phaser from 'phaser'
import axios from 'axios'
import config from '../config/config.js'
import GuiManager from '../manager/GuiManager.js'
import gameSettings from '../config/gameSettings.js'
import InterfaceManager from './InterfaceScene.js'
import artifactSettings, {
	ATTRIBUTE_SHORTHANDS,
} from '../config/artifactSettings.js'
import { EventBus } from '../EventBus.js'
import handleWalletConnected from '../mode/attachWalletConnectedHandler.js'
import { resetBase, saveBaseStats } from '../utils/adjustStats.js'
// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'
const artifactCollectionIdentifiers = [
	'0x4e3c52b995cc807025ee73b884d808c08c4f68533c9b1a37af62725a3feb2146::create_nft_with_random_attributes::NFT',
]
// const fighterCollectionIdentifiers = [
// 	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstFighter',
// ]

const R2_BASE_URL =
	'https://pub-6fe5b035dcc2464fb086ecf502050173.r2.dev/artifact-nft'

const mockFighterNFTs = [
	{
		selectedPlayerIndex: 1,
		objectId: '0xfighter01',
		name: 'Falcon',
		imageUrl: 'assets/nft-fighters/plane_01.png',
		description:
			'A swift and agile fighter, the Falcon excels in hit-and-run tactics. Its advanced propulsion system allows for quick maneuvers in tight spaces.',
	},
	{
		selectedPlayerIndex: 2,
		objectId: '0xfighter02',
		name: 'Eagle',
		imageUrl: 'assets/nft-fighters/plane_02.png',
		description:
			'The Eagle is a versatile combat vessel with balanced offensive and defensive capabilities. Its enhanced sensor suite provides superior tactical awareness.',
	},
	{
		selectedPlayerIndex: 3,
		objectId: '0xfighter03',
		name: 'Hawk',
		imageUrl: 'assets/nft-fighters/plane_03.png',
		description:
			'A lightweight scout ship, the Hawk specializes in reconnaissance missions. Its stealth systems make it nearly invisible to enemy radar.',
	},
	{
		selectedPlayerIndex: 4,
		objectId: '0xfighter04',
		name: 'Vulture',
		imageUrl: 'assets/nft-fighters/plane_04.png',
		description:
			'The Vulture is a heavy assault craft built for extended combat. Its reinforced hull and powerful shields can withstand significant damage.',
	},
	{
		selectedPlayerIndex: 5,
		objectId: '0xfighter05',
		name: 'Phoenix',
		imageUrl: 'assets/nft-fighters/plane_05.png',
		description:
			'Rising from advanced alien technology, the Phoenix can regenerate its shields over time. Its unique design incorporates self-repairing nanomaterials.',
	},
	{
		selectedPlayerIndex: 6,
		objectId: '0xfighter06',
		name: 'Mockingbird',
		imageUrl: 'assets/nft-fighters/plane_06.png',
		description:
			'The Mockingbird is a support vessel equipped with electronic warfare systems. It can disrupt enemy communications and weapons systems.',
	},
	{
		selectedPlayerIndex: 7,
		objectId: '0xfighter07',
		name: 'Raven',
		imageUrl: 'assets/nft-fighters/plane_07.png',
		description:
			'A stealth bomber class ship, the Raven carries heavy ordnance while maintaining a low profile. Perfect for surgical strikes behind enemy lines.',
	},
	{
		selectedPlayerIndex: 8,
		objectId: '0xfighter08',
		name: 'Condor',
		imageUrl: 'assets/nft-fighters/plane_08.png',
		description:
			'The Condor is a massive carrier vessel with extensive cargo capacity. It can deploy autonomous combat drones to support allies in battle.',
	},
	{
		selectedPlayerIndex: 9,
		objectId: '0xfighter09',
		name: 'Albatross',
		imageUrl: 'assets/nft-fighters/plane_09.png',
		description:
			'An experimental quantum ship, the Albatross can briefly phase through space-time. Its advanced propulsion system enables short-range teleportation.',
	},
]

const ATTRIBUTE_TIERS = {
	'buff rate': 3,
	lifesteal: 2,
	'health generation': 2,
	speed: 1,
	'max health': 1,
	armor: 1,
	'bullet dmg': 1,
	'fire rate': 1,
	'bullet size': 1,
}

class SelectUtility extends Phaser.Scene {
	constructor() {
		super('selectUtility')
		this.guiManager = new GuiManager(this)
		this.selectedTab = 'fighter'
		this.selectedFighterName = '1'
		this.selectedArtifact = 1
		this.infoCardVisible = false
		this.artifactDetails = []
		this.fighterDetails = []
		this.infoCard = null
		this.callingScene = 'selectUtility'

		// console.log(
		// 	'Scene constructed with empty artifactDetails:',
		// 	this.artifactDetails,
		// )

		// Pagination State
		this.currentFighterPage = 0
		this.currentArtifactPage = 0
		this.fighterPageIndicators = []
		this.artifactPageIndicators = []
		this.fighterPaginationContainer = null
		this.artifactPaginationContainer = null
	}

	init() {
		if (!this.checkAuth()) {
			return
		}

		EventBus.on('wallet-connected', this.handleWalletConnected, this)
	}

	shutdown() {
		EventBus.off('wallet-connected', this.handleWalletConnected, this)
		this.artifactDetails = []

		// Clear artifact textures from cache
		this.artifactDetails.forEach((_, index) => {
			const textureKey = `item_image_${index + 1}`
			if (this.textures.exists(textureKey)) {
				this.textures.remove(textureKey)
			}
		})

		// Also clear any other generated textures
		if (this.artifactGrids) {
			this.artifactGrids.forEach((grid) => grid.destroy())
		}
		this.artifactGrids = []
	}

	async preload() {
		// Load UI plugin
		this.load.scenePlugin(
			'rexuiplugin',
			'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
			'rexUI',
			'rexUI',
		)

		// Load Logo and Background
		this.guiManager.loadImage('logo', 'assets/main-menu/logo.png')
		this.load.image('background', 'assets/main-menu/background.png')

		// Load CARDS
		this.load.image(
			'card_fighter',
			'assets/main-menu/select-utility/card-fighter.png',
		)
		this.load.image(
			'card_artifact',
			'assets/main-menu/select-utility/card-artifact.png',
		)
		this.load.image(
			'card_info',
			'assets/main-menu/select-utility/card-info.png',
		)
		this.load.image(
			'card_qslot',
			'assets/main-menu/select-utility/card-qslot.png',
		)
		this.load.image(
			'card_selected',
			'assets/main-menu/select-utility/card-selected.png',
		)
		this.load.image(
			'card_desc',
			'assets/main-menu/select-utility/card-desc.png',
		)

		// Load item frames
		this.load.image(
			'item_frame',
			'assets/main-menu/select-utility/item-frame.png',
		)
		this.load.image(
			'item_frame_selected',
			'assets/main-menu/select-utility/item-frame-selected.png',
		)

		// Load attributes tier icons
		this.load.image('tier1', 'assets/main-menu/select-utility/tier1.png')
		this.load.image(
			'tier1_hover',
			'assets/main-menu/select-utility/tier1-hover.png',
		)

		this.load.image('tier2', 'assets/main-menu/select-utility/tier2.png')
		this.load.image(
			'tier2_hover',
			'assets/main-menu/select-utility/tier2-hover.png',
		)

		this.load.image('tier3', 'assets/main-menu/select-utility/tier3.png')
		this.load.image(
			'tier3_hover',
			'assets/main-menu/select-utility/tier3-hover.png',
		)

		// Load BUTTONS
		this.load.image(
			'button_save',
			'assets/main-menu/select-utility/button-save.png',
		)
		this.load.image(
			'button_save_hover',
			'assets/main-menu/select-utility/button-save-hover.png',
		)
		this.load.image(
			'button_pick',
			'assets/main-menu/select-utility/button-pick.png',
		)
		this.load.image(
			'button_pick_hover',
			'assets/main-menu/select-utility/button-pick-hover.png',
		)
		this.load.image(
			'button_fighter',
			'assets/main-menu/select-utility/button-fighter.png',
		)
		this.load.image(
			'button_fighter_hover',
			'assets/main-menu/select-utility/button-fighter-hover.png',
		)
		this.load.image(
			'button_artifact',
			'assets/main-menu/select-utility/button-artifact.png',
		)
		this.load.image(
			'button_artifact_hover',
			'assets/main-menu/select-utility/button-artifact-hover.png',
		)

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		const width = this.cameras.main.width
		const height = this.cameras.main.height

		// Add loading text
		const loadingText = this.add
			.text(width / 2, height / 2 - 50, 'Loading...', {
				fontFamily: 'Pixelify Sans',
				fontSize: '32px',
				color: '#ffffff',
			})
			.setOrigin(0.5)

		this.load.on('complete', () => {
			loadingText.destroy()
		})

		// Preload Fighter assets from mapping
		// Preload NFT images from mockFighterNFTs
		mockFighterNFTs.forEach((nft) => {
			this.load.image(nft.name, nft.imageUrl)
		})
	}

	async create() {
		console.log('Player Index ', gameSettings.selectedPlayerIndex)
		console.log('Artifact Index ', gameSettings.selectedArtifactIndex)
		console.log('User Active ', gameSettings.userActive)
		console.log('Wallet Connected ', gameSettings.userWalletAdress)

		/* ----------------------------INIT---------------------------- */
		this.cameras.main.fadeIn(2000, 0, 0, 0)
		this.interfaceManager = new InterfaceManager(this)

		for (let i = 1; i <= 1000; i++) {
			// assuming max 10 artifacts
			const textureKey = `item_image_${i}`
			if (this.textures.exists(textureKey)) {
				this.textures.remove(textureKey)
			}
		}

		// Reset artifact-related properties
		this.artifactDetails = []
		this.artifactGrids = []
		this.currentArtifactPage = 0

		// Load saved selection from localStorage
		// console.log('Current wallet:', gameSettings.userWalletAdress)
		this.loadSelection()
		/* ----------------------------INIT---------------------------- */

		/* ----------------------------DATA LOADING/FETCHING---------------------------- */
		// Only fetch artifacts if they haven't been fetched before
		if (this.artifactDetails.length === 0) {
			try {
				this.artifactDetails = []
				await this.getOwnedArtifactsAndDetails()
				await this.preloadAllArtifactImages()
			} catch (error) {
				console.error('Error loading artifact images from storage:', error)
			}
		} else {
			// console.log('Artifacts are already loaded.')
		}

		// Fetch Fighter NFTs (mocked)
		this.fighterDetails = await this.getMockFighterNFTs()
		/* ----------------------------DATA LOADING/FETCHING---------------------------- */

		/* ----------------------------UI SECTION---------------------------- */
		// Create UI elements
		this.guiManager.createBackground('background')
		this.createSuilaxyTextAndLogo()
		this.createTabs()
		this.createSaveButton()
		this.createPickButton()

		if (this.infoCardVisible) {
			this.createInfoCard()
		}

		this.fighterCard = this.createFighterCard(
			config.width / 4.1,
			config.height / 2.1,
		)
		this.fighterCard.setVisible(this.selectedTab === 'fighter')

		this.artifactCard = this.createArtifactCard(
			config.width / 4.1,
			config.height / 2.1,
		)
		this.artifactCard.setVisible(this.selectedTab === 'artifact')
		/* ----------------------------UI SECTION---------------------------- */

		/* ----------------------------UPDATE---------------------------- */
		this.updateCardVisibility()
		this.updateInfoCard()
		/* ----------------------------UPDATE---------------------------- */

		/* ----------------------------EVENT LISTENERS---------------------------- */
		// Listen for wallet disconnection
		EventBus.on('wallet-connected', handleWalletConnected, this)
	}

	/* ----------------------------GUI CREATE---------------------------- */
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

	createSaveButton() {
		const saveButton = this.add.image(
			config.width / 5.5,
			config.height / 1.233,
			'button_save',
		)
		saveButton.setInteractive()

		const hoverTween = {
			scale: 1.05,
			duration: 150,
			ease: 'Power2',
		}

		const normalTween = {
			scale: 1,
			duration: 150,
			ease: 'Power2',
		}

		saveButton.on('pointerdown', () => {
			// Ensure valid values
			const fighterIndex = parseInt(this.selectedFighterName) || 1
			const artifactIndex = this.selectedArtifact || 1

			// Update game settings
			gameSettings.selectedPlayerIndex = fighterIndex
			gameSettings.selectedArtifactIndex = artifactIndex

			// Save to localStorage
			this.saveSelection(fighterIndex, artifactIndex)
			this.interfaceManager.goToMainMenu(0)
		})

		saveButton.on('pointerover', () => {
			this.tweens.killTweensOf(saveButton)

			this.tweens.add({
				targets: saveButton,
				...hoverTween,
			})
			saveButton.setTexture('button_save_hover')
		})

		saveButton.on('pointerout', () => {
			this.tweens.killTweensOf(saveButton)

			this.tweens.add({
				targets: saveButton,
				...normalTween,
			})
			saveButton.setTexture('button_save')
		})
	}

	createPickButton() {
		const pickButton = this.add.image(
			config.width / 3.3,
			config.height / 1.233,
			'button_pick',
		)
		pickButton.setInteractive()

		const hoverTween = {
			scale: 1.05,
			duration: 150,
			ease: 'Power2',
		}

		const normalTween = {
			scale: 1,
			duration: 150,
			ease: 'Power2',
		}

		pickButton.on('pointerdown', () => {
			// Ensure valid values
			const fighterIndex = parseInt(this.selectedFighterName) || 1
			const artifactIndex = this.selectedArtifact || 1

			// Update game settings
			gameSettings.selectedPlayerIndex = fighterIndex
			gameSettings.selectedArtifactIndex = artifactIndex

			// Save selection
			this.saveSelection(fighterIndex, artifactIndex)
		})

		pickButton.on('pointerover', () => {
			this.tweens.killTweensOf(pickButton)
			this.tweens.add({
				targets: pickButton,
				...hoverTween,
			})
			pickButton.setTexture('button_pick_hover')
		})

		pickButton.on('pointerout', () => {
			this.tweens.killTweensOf(pickButton)
			this.tweens.add({
				targets: pickButton,
				...normalTween,
			})
			pickButton.setTexture('button_pick')
		})
	}
	/* ----------------------------GUI CREATE---------------------------- */

	/* ----------------------------TAB---------------------------- */
	createTabs() {
		// Calculate base tab positions
		const baseX = config.width / 20
		const baseY = config.height / 3.3
		const spacing = 115

		// Create both tab buttons with relative positioning
		const fighterTabButton = this.createFighterTabButton(baseX, baseY)
		const artifactTabButton = this.createArtifactTabButton(
			baseX,
			baseY + spacing,
		)

		this.updateTabDisplay()

		return { fighterTabButton, artifactTabButton }
	}

	updateTabDisplay() {
		if (this.fighterButton && this.artifactButton) {
			if (this.selectedTab === 'fighter') {
				this.fighterButton.setTexture('button_fighter_hover')
				this.artifactButton.setTexture('button_artifact')
			} else {
				this.fighterButton.setTexture('button_fighter')
				this.artifactButton.setTexture('button_artifact_hover')
			}
		}
	}

	updateCardVisibility() {
		if (this.fighterCard && this.artifactCard) {
			// Fighter card and grids
			this.fighterCard.setVisible(this.selectedTab === 'fighter')
			if (this.fighterGrids) {
				this.fighterGrids.forEach((grid) =>
					grid.setVisible(
						grid === this.fighterGrids[this.currentFighterPage] &&
							this.selectedTab === 'fighter',
					),
				)
			}
			if (this.fighterPaginationContainer) {
				this.fighterPaginationContainer.setVisible(
					this.selectedTab === 'fighter',
				)
			}

			// Artifact card and grids
			this.artifactCard.setVisible(this.selectedTab === 'artifact')
			if (this.artifactGrids) {
				this.artifactGrids.forEach((grid) =>
					grid.setVisible(
						grid === this.artifactGrids[this.currentArtifactPage] &&
							this.selectedTab === 'artifact',
					),
				)
			}
			if (this.artifactPaginationContainer) {
				this.artifactPaginationContainer.setVisible(
					this.selectedTab === 'artifact',
				)
			}
		}
	}

	createFighterTabButton(width, height) {
		const fighterButton = this.add.image(width, height, 'button_fighter')
		fighterButton.setInteractive()

		// Store reference to button
		this.fighterButton = fighterButton

		const hoverTween = {
			scale: 1.05,
			duration: 150,
			ease: 'Power2',
		}

		const normalTween = {
			scale: 1,
			duration: 150,
			ease: 'Power2',
		}

		fighterButton.on('pointerdown', () => {
			if (this.selectedTab !== 'fighter') {
				// Kill any active tweens from artifact pagination
				if (this.artifactPageIndicators) {
					this.artifactPageIndicators.forEach((indicator) => {
						this.tweens.killTweensOf(indicator.inner)
					})
				}

				this.selectedTab = 'fighter'
				this.currentFighterPage = 0
				this.updateTabDisplay()
				this.updateCardVisibility()
				this.updateFighterPageIndicators()
			}
		})

		fighterButton.on('pointerover', () => {
			if (this.selectedTab !== 'fighter') {
				// Only show hover if not active
				this.tweens.killTweensOf(fighterButton)
				this.tweens.add({
					targets: fighterButton,
					...hoverTween,
				})
				fighterButton.setTexture('button_fighter_hover')
			}
		})

		fighterButton.on('pointerout', () => {
			if (this.selectedTab !== 'fighter') {
				// Only revert if not active
				this.tweens.killTweensOf(fighterButton)
				this.tweens.add({
					targets: fighterButton,
					...normalTween,
				})
				fighterButton.setTexture('button_fighter')
			}
		})

		return fighterButton
	}

	createArtifactTabButton(width, height) {
		const artifactButton = this.add.image(width, height, 'button_artifact')
		artifactButton.setInteractive()

		// Store reference to button
		this.artifactButton = artifactButton

		const hoverTween = {
			scale: 1.05,
			duration: 150,
			ease: 'Power2',
		}

		const normalTween = {
			scale: 1,
			duration: 150,
			ease: 'Power2',
		}

		artifactButton.on('pointerdown', () => {
			if (this.fighterPageIndicators) {
				this.fighterPageIndicators.forEach((indicator) => {
					this.tweens.killTweensOf(indicator.inner)
				})
			}

			this.selectedTab = 'artifact'
			this.currentArtifactPage = 0
			this.updateTabDisplay()
			this.updateCardVisibility()
			this.updateArtifactPageIndicators()
		})

		artifactButton.on('pointerover', () => {
			if (this.selectedTab !== 'artifact') {
				this.tweens.killTweensOf(artifactButton)
				this.tweens.add({
					targets: artifactButton,
					...hoverTween,
				})
				artifactButton.setTexture('button_artifact_hover')
			}
		})

		artifactButton.on('pointerout', () => {
			if (this.selectedTab !== 'artifact') {
				// Only revert if not active
				this.tweens.killTweensOf(artifactButton)
				this.tweens.add({
					targets: artifactButton,
					...normalTween,
				})
				artifactButton.setTexture('button_artifact')
			}
		})

		return artifactButton
	}
	/* ----------------------------TAB---------------------------- */

	/* ----------------------------FIGHTER CARD---------------------------- */
	createFighterCard(x, y) {
		const cardBackground = this.add.image(x, y, 'card_fighter')
		this.fighterGrids = []
		const itemsPerPage = 9
		const itemsPerRow = 3
		const gridSpacing = 100

		const totalPages = Math.ceil(this.fighterDetails.length / itemsPerPage)
		this.currentFighterPage = 0

		for (let page = 0; page < totalPages; page++) {
			const pageContainer = this.add.container(x, y)

			// Create items for this page
			for (let i = 0; i < itemsPerPage; i++) {
				const itemIndex = page * itemsPerPage + i
				if (itemIndex >= this.fighterDetails.length) break

				const row = Math.floor(i / itemsPerRow)
				const col = i % itemsPerRow

				const itemX = -110 + col * gridSpacing * 1.1
				const itemY = -95 + row * gridSpacing

				const frame = this.add
					.image(itemX, itemY, 'item_frame')
					.setScale(1)
					.setInteractive()

				const fighterData = this.fighterDetails[itemIndex]
				const fighterImage = this.add
					.image(itemX, itemY, fighterData.name)
					.setScale(1)

				this.addFighterItemInteraction(
					frame,
					fighterImage,
					fighterData.selectedPlayerIndex,
				)
				pageContainer.add([frame, fighterImage])
			}

			// Add the page container to grids array AFTER adding all items
			this.fighterGrids.push(pageContainer)
			pageContainer.setVisible(page === 0)
		}

		// Add pagination if needed
		if (totalPages > 1) {
			this.fighterPaginationContainer = this.addFighterPagination(
				x,
				y + 165,
				totalPages,
			)
		}

		return cardBackground
	}

	addFighterItemInteraction(frame, fighterImage) {
		frame.on('pointerover', () => {
			this.tweens.add({
				targets: [frame, fighterImage],
				scale: '1.05',
				duration: 150,
				ease: 'Power2',
			})
		})

		frame.on('pointerout', () => {
			this.tweens.add({
				targets: [frame, fighterImage],
				scale: '1',
				duration: 150,
				ease: 'Power2',
			})
		})

		frame.on('pointerdown', () => {
			this.selectFighter(
				this.fighterDetails.findIndex(
					(f) => f.name === fighterImage.texture.key,
				),
			)
		})
	}

	addFighterPagination(x, y, totalPages) {
		const paginationContainer = this.add.container(x, y)
		paginationContainer.setVisible(this.selectedTab === 'fighter')

		const spacing = 25
		const startX = -(spacing * (totalPages - 1)) / 2

		this.fighterPageIndicators = []

		for (let i = 0; i < totalPages; i++) {
			const indicatorContainer = this.add.container(startX + i * spacing, 0)

			const outerHex = this.add
				.polygon(0, 0, [
					[-8, 0],
					[-4, -3],
					[4, -3],
					[8, 0],
					[4, 3],
					[-4, 3],
				])
				.setStrokeStyle(1, 0x335566)
				.setFillStyle(0x111111, 0.3)

			const innerHex = this.add
				.polygon(0, 0, [
					[-4, 0],
					[-2, -1.5],
					[2, -1.5],
					[4, 0],
					[2, 1.5],
					[-2, 1.5],
				])
				.setFillStyle(0x335566, 0.2)

			indicatorContainer.add([outerHex, innerHex])

			indicatorContainer
				.setSize(22, 20)
				.setInteractive()
				.on('pointerdown', () => this.changeFighterPage(i))
				.on('pointerover', () => {
					if (this.currentFighterPage !== i) {
						outerHex.setStrokeStyle(1, 0x00ff99)
						innerHex.setFillStyle(0x00ff99, 0.2)
					}
				})
				.on('pointerout', () => {
					if (this.currentFighterPage !== i) {
						outerHex.setStrokeStyle(1, 0x335566)
						innerHex.setFillStyle(0x335566, 0.2)
					}
				})

			this.fighterPageIndicators.push({
				container: indicatorContainer,
				outer: outerHex,
				inner: innerHex,
			})
		}

		paginationContainer.add(this.fighterPageIndicators.map((p) => p.container))
		this.updateFighterPageIndicators()
		return paginationContainer
	}

	changeFighterPage(newPage) {
		if (this.fighterPageIndicators[this.currentFighterPage]) {
			this.tweens.killTweensOf(
				this.fighterPageIndicators[this.currentFighterPage].inner,
			)
		}

		this.fighterGrids[this.currentFighterPage].setVisible(false)
		this.currentFighterPage = newPage
		this.fighterGrids[this.currentFighterPage].setVisible(true)

		this.updateFighterPageIndicators()
	}

	updateFighterPageIndicators() {
		if (this.fighterPageIndicators) {
			this.fighterPageIndicators.forEach((indicator, index) => {
				if (index === this.currentFighterPage) {
					indicator.outer
						.setStrokeStyle(2, 0x00ff99)
						.setFillStyle(0x002211, 0.6)
					indicator.inner.setFillStyle(0x00ff99, 0.4)

					this.tweens.add({
						targets: indicator.inner,
						fillAlpha: { from: 0.2, to: 0.6 },
						duration: 750,
						yoyo: true,
						repeat: -1,
						ease: 'Sine.easeInOut',
					})
				} else {
					indicator.outer
						.setStrokeStyle(1, 0x335566)
						.setFillStyle(0x111111, 0.3)
					indicator.inner.setFillStyle(0x335566, 0.2)
					this.tweens.killTweensOf(indicator.inner)
				}
			})
		}
	}

	selectFighter(index) {
		// Get the actual fighter data from the fighterDetails array
		const fighter = this.fighterDetails[index]
		if (fighter) {
			// Store the actual fighter name/ID instead of just the index
			this.selectedFighterName = fighter.selectedPlayerIndex.toString()
			this.infoCardVisible = true
			this.updateInfoCard()
		}
	}

	/* ----------------------------FIGHTER CARD---------------------------- */

	/* ----------------------------ARTIFACT CARD---------------------------- */
	createArtifactCard(x, y) {
		// Background with fixed size (417x410)
		const cardBackground = this.add.image(x, y, 'card_artifact')

		// Container for grid items that we can show/hide per page
		this.artifactGrids = []
		const itemsPerPage = 9
		const itemsPerRow = 3
		const gridSpacing = 100

		// Calculate pages
		const totalPages = Math.ceil(this.artifactDetails.length / itemsPerPage)
		this.currentArtifactPage = 0

		// Create items for each page
		for (let page = 0; page < totalPages; page++) {
			const pageContainer = this.add.container(x, y)

			// Create grid items for this page
			for (let i = 0; i < itemsPerPage; i++) {
				const itemIndex = page * itemsPerPage + i
				if (itemIndex >= this.artifactDetails.length) break

				const row = Math.floor(i / itemsPerRow)
				const col = i % itemsPerRow

				// Calculate grid position
				const itemX = -110 + col * gridSpacing * 1.1
				const itemY = -95 + row * gridSpacing

				// Create frame and artifact image
				const frame = this.add
					.image(itemX, itemY, 'item_frame')
					.setScale(1)
					.setInteractive()

				const artifactImage = this.add
					.image(itemX, itemY, `item_image_${itemIndex + 1}`)
					.setScale(1)

				this.addArtifactItemInteraction(frame, artifactImage, itemIndex + 1)
				pageContainer.add([frame, artifactImage])
			}

			this.artifactGrids.push(pageContainer)
			pageContainer.setVisible(page === 0)
		}
		// Add pagination if needed
		if (totalPages > 1) {
			this.artifactPaginationContainer = this.addArtifactPagination(
				x,
				y + 165,
				totalPages,
			)
		}

		return cardBackground
	}

	addArtifactItemInteraction(frame, artifactImage, index) {
		frame.on('pointerover', () => {
			this.tweens.add({
				targets: [frame, artifactImage],
				scale: '1.05',
				duration: 150,
				ease: 'Power2',
			})
		})

		frame.on('pointerout', () => {
			this.tweens.add({
				targets: [frame, artifactImage],
				scale: '1',
				duration: 150,
				ease: 'Power2',
			})
		})

		frame.on('pointerdown', () => {
			this.selectArtifact(index)
		})
	}

	addArtifactPagination(x, y, totalPages) {
		const paginationContainer = this.add.container(x, y)
		paginationContainer.setVisible(this.selectedTab === 'artifact')

		const spacing = 25
		const startX = -(spacing * (totalPages - 1)) / 2

		this.artifactPageIndicators = []

		for (let i = 0; i < totalPages; i++) {
			const indicatorContainer = this.add.container(startX + i * spacing, 0)

			const outerHex = this.add
				.polygon(0, 0, [
					[-8, 0],
					[-4, -3],
					[4, -3],
					[8, 0],
					[4, 3],
					[-4, 3],
				])
				.setStrokeStyle(1, 0x335566)
				.setFillStyle(0x111111, 0.3)

			const innerHex = this.add
				.polygon(0, 0, [
					[-4, 0],
					[-2, -1.5],
					[2, -1.5],
					[4, 0],
					[2, 1.5],
					[-2, 1.5],
				])
				.setFillStyle(0x335566, 0.2)

			indicatorContainer.add([outerHex, innerHex])

			indicatorContainer
				.setSize(22, 20)
				.setInteractive()
				.on('pointerdown', () => this.changeArtifactPage(i))
				.on('pointerover', () => {
					if (this.currentArtifactPage !== i) {
						outerHex.setStrokeStyle(1, 0x00ff99)
						innerHex.setFillStyle(0x00ff99, 0.2)
					}
				})
				.on('pointerout', () => {
					if (this.currentArtifactPage !== i) {
						outerHex.setStrokeStyle(1, 0x335566)
						innerHex.setFillStyle(0x335566, 0.2)
					}
				})

			this.artifactPageIndicators.push({
				container: indicatorContainer,
				outer: outerHex,
				inner: innerHex,
			})
		}

		paginationContainer.add(this.artifactPageIndicators.map((p) => p.container))
		this.updateArtifactPageIndicators()
		return paginationContainer
	}

	changeArtifactPage(newPage) {
		if (this.artifactPageIndicators[this.currentArtifactPage]) {
			this.tweens.killTweensOf(
				this.artifactPageIndicators[this.currentArtifactPage].inner,
			)
		}

		this.artifactGrids[this.currentArtifactPage].setVisible(false)
		this.currentArtifactPage = newPage
		this.artifactGrids[this.currentArtifactPage].setVisible(true)

		this.updateArtifactPageIndicators()
	}

	updateArtifactPageIndicators() {
		if (this.artifactPageIndicators) {
			this.artifactPageIndicators.forEach((indicator, index) => {
				if (index === this.currentArtifactPage) {
					indicator.outer
						.setStrokeStyle(2, 0x00ff99)
						.setFillStyle(0x002211, 0.6)
					indicator.inner.setFillStyle(0x00ff99, 0.4)

					this.tweens.add({
						targets: indicator.inner,
						fillAlpha: { from: 0.2, to: 0.6 },
						duration: 750,
						yoyo: true,
						repeat: -1,
						ease: 'Sine.easeInOut',
					})
				} else {
					indicator.outer
						.setStrokeStyle(1, 0x335566)
						.setFillStyle(0x111111, 0.3)
					indicator.inner.setFillStyle(0x335566, 0.2)
					this.tweens.killTweensOf(indicator.inner)
				}
			})
		}
	}

	selectArtifact(index) {
		this.selectedArtifact = index
		this.infoCardVisible = true

		// Get the selected artifact details
		const selectedArtifact = this.artifactDetails[index - 1]

		if (selectedArtifact) {
			resetBase()
			// Apply new artifact attributes
			const modifiedSettings = artifactSettings.applyArtifactAttributes(
				gameSettings,
				selectedArtifact,
			)

			console.log('Modified settings: ', modifiedSettings)
			saveBaseStats(modifiedSettings)
		}

		this.updateInfoCard()
	}

	/* ----------------------------ARTIFACT CARD---------------------------- */

	/* ----------------------------INFO CARD---------------------------- */
	createInfoCard() {
		if (this.infoCard) {
			// If info card already exists, destroy it first
			this.infoCard.destroy()
			this.infoName?.destroy()
			this.infoImage?.destroy()
			this.infoDescription?.destroy()
			this.descriptionCard?.destroy()
		}

		const x = config.width / 1.74
		const y = config.height / 1.31

		// Create a container for all info card elements
		this.infoCard = this.add.container(0, 0)

		const cardBackground = this.add.image(x, y, 'card_info')

		// Add description card background
		this.descriptionCard = this.add.image(x, y + 90, 'card_desc')

		// Add item name text with styling
		this.infoName = this.add
			.text(x, y - 290, '', {
				fontFamily: 'Pixelify Sans',
				fontSize: '24px',
				color: '#FFFFFF',
				align: 'center',
				stroke: '#006752',
				strokeThickness: 5,
			})
			.setOrigin(0.5)

		// Add image
		this.infoImage = this.add.image(x, y - 210, '').setScale(1)

		// Add description text with word wrap
		this.infoDescription = this.add
			.text(x, y + 90, '', {
				fontFamily: 'Pixelify Sans',
				fontSize: '16px',
				color: '#FFFFFF',
				align: 'center',
				wordWrap: { width: 280 },
				lineSpacing: 6,
			})
			.setOrigin(0.5)

		// Add all elements to the container
		this.infoCard.add([
			cardBackground,
			this.descriptionCard,
			this.infoName,
			this.infoImage,
			this.infoDescription,
		])

		// Set initial visibility based on infoCardVisible flag
		this.infoCard.setVisible(this.infoCardVisible)

		return this.infoCard
	}

	updateInfoCard() {
		if (!this.infoCard) {
			this.createInfoCard()
		}

		// Handle empty artifact case first
		if (this.selectedTab === 'artifact' && this.artifactDetails.length === 0) {
			if (this.infoCard) {
				// Clear any existing content
				this.infoName?.setText('')
				this.infoImage?.setVisible(false)
				this.infoDescription?.setText('No artifacts found')

				// Clear any existing attribute containers
				if (this.attributeContainers) {
					this.attributeContainers.forEach((container) => container.destroy())
					this.attributeContainers = []
				}
			}
			return
		}

		// Set visibility based on whether we have a selection
		this.infoCardVisible =
			(this.selectedTab === 'artifact' && this.selectedArtifact !== -1) ||
			(this.selectedTab === 'fighter' && this.selectedFighterName !== null)

		this.infoCard.setVisible(this.infoCardVisible)

		if (!this.infoCardVisible) {
			return
		}

		if (this.selectedTab === 'artifact') {
			this.updateArtifactInfo()
		} else {
			this.updateFighterInfo()
		}
	}

	updateFighterInfo() {
		if (!this.selectedFighterName || !this.fighterDetails.length) {
			return
		}

		// Clear any existing attribute containers from artifact view
		if (this.attributeContainers) {
			this.attributeContainers.forEach((container) => container.destroy())
			this.attributeContainers = []
		}

		const selectedFighter = this.fighterDetails.find(
			(fighter) =>
				fighter.selectedPlayerIndex.toString() === this.selectedFighterName,
		)

		if (!selectedFighter) {
			return
		}

		// Update the info card with the correct fighter data
		this.infoName.setText(selectedFighter.name || '')

		// Position description card and text
		this.descriptionCard.setPosition(this.infoImage.x, this.infoImage.y + 160)
		this.infoDescription
			.setText(selectedFighter.description || selectedFighter.name)
			.setPosition(this.infoImage.x, this.infoImage.y + 170)

		if (this.textures.exists(selectedFighter.name)) {
			this.infoImage.setTexture(selectedFighter.name)
			this.infoImage.setVisible(true)
			this.infoImage.setScale(1.3)
		}
	}

	updateArtifactInfo() {
		// Add early return for empty artifacts case
		if (this.artifactDetails.length === 0) {
			this.infoName?.setText('')
			this.infoImage?.setVisible(false)
			this.infoDescription?.setText('No artifacts found')
			return
		}

		if (this.selectedArtifact === -1 || !this.artifactDetails.length) {
			return
		}

		const selectedArtifact = this.artifactDetails[this.selectedArtifact - 1]
		if (!selectedArtifact) {
			return
		}

		this.infoName.setText(selectedArtifact.name || '')

		const tierGroups = {
			1: [], // Green
			2: [], // Yellow
			3: [], // Purple
		}

		if (selectedArtifact.attributes && selectedArtifact.attributes.length > 0) {
			selectedArtifact.attributes.forEach((attr) => {
				if (parseInt(attr.value) > 0) {
					// Only include non-zero attributes
					const tier = ATTRIBUTE_TIERS[attr.name] || 3
					const shorthand =
						ATTRIBUTE_SHORTHANDS[attr.name] || attr.name.toUpperCase()
					tierGroups[tier].push({
						shorthand,
						value: attr.value,
						name: attr.name,
					})
				}
			})
		}

		// Clear existing attribute displays
		if (this.attributeContainers) {
			this.attributeContainers.forEach((container) => container.destroy())
		}
		this.attributeContainers = []

		const GRID_CONFIG = {
			startX: this.infoImage.x - 163,
			startY: this.infoImage.y + 70,
			columnWidth: 102, // Width of tier background
			rowHeight: 40, // Height between rows
			columns: 3, // Number of columns
			columnSpacing: 10, // Space between columns
		}

		// Combine all non-zero attributes while maintaining tier order
		const allAttributes = [...tierGroups[1], ...tierGroups[2], ...tierGroups[3]]

		// Create grid layout
		allAttributes.forEach((attr, index) => {
			const column = index % GRID_CONFIG.columns
			const row = Math.floor(index / GRID_CONFIG.columns)
			const tier = ATTRIBUTE_TIERS[attr.name]

			const x =
				GRID_CONFIG.startX +
				column * (GRID_CONFIG.columnWidth + GRID_CONFIG.columnSpacing)
			const y = GRID_CONFIG.startY + row * GRID_CONFIG.rowHeight

			const container = this.add.container(0, 0)

			const bg = this.add
				.image(x + GRID_CONFIG.columnWidth / 2, y + 17, `tier${tier}`)
				.setOrigin(0.5)

			// Add attribute text
			const text = this.add
				.text(x + 40, y + 8, `${attr.shorthand} ${attr.value}`, {
					fontFamily: 'Pixelify Sans',
					fontSize: '16px',
					color: '#FFFFFF',
					align: 'left',
				})
				.setOrigin(0)

			container.add([bg, text])
			this.attributeContainers.push(container)
		})

		// Calculate description position based on last row of attributes
		const totalRows = Math.ceil(allAttributes.length / GRID_CONFIG.columns)
		const descriptionY =
			GRID_CONFIG.startY + totalRows * GRID_CONFIG.rowHeight + 90

		// Update description card position
		this.descriptionCard.setPosition(GRID_CONFIG.startX + 160, descriptionY)

		// Update description text
		const description = selectedArtifact.description || ''
		this.infoDescription
			.setText(this.truncateText(description, 160))
			.setPosition(GRID_CONFIG.startX + 160, descriptionY + 10)

		// Add all containers to the info card
		this.attributeContainers.forEach((container) => {
			this.infoCard.add(container)
		})

		// Update image
		const imageKey = `item_image_${this.selectedArtifact}`
		if (this.textures.exists(imageKey)) {
			this.infoImage.setTexture(imageKey)
			this.infoImage.setVisible(true)
			this.infoImage.setScale(1.3)
		}
	}
	/* ----------------------------INFO CARD---------------------------- */

	/* ----------------------------SAVE/LOAD---------------------------- */
	saveSelection(fighter, artifact) {
		const fighterIndex = parseInt(fighter, 10)
		const artifactIndex = parseInt(artifact, 10)

		// First update gameSettings
		if (fighterIndex > 0) {
			gameSettings.selectedPlayerIndex = fighterIndex
			localStorage.setItem('selectedFighter', fighterIndex)
			this.selectedFighterName = fighterIndex.toString()
		}

		if (artifactIndex > 0) {
			gameSettings.selectedArtifactIndex = artifactIndex
			localStorage.setItem('selectedArtifact', artifactIndex)
		}
	}

	loadSelection() {
		const savedFighter = localStorage.getItem('selectedFighter')
		const savedArtifact = localStorage.getItem('selectedArtifact')

		// Set both selectedFighterName and selectedFighter
		if (savedFighter) {
			const fighterIndex = parseInt(savedFighter, 10)
			this.selectedFighterName = fighterIndex.toString()
			this.selectedFighterIndex = fighterIndex
			gameSettings.selectedPlayerIndex = fighterIndex
		} else {
			// Default values if nothing is saved
			this.selectedFighterName = '1'
			gameSettings.selectedPlayerIndex = 1
			this.selectedFighterIndex = 1
		}

		if (savedArtifact) {
			const artifactIndex = parseInt(savedArtifact, 10)
			this.selectedArtifact = artifactIndex
			gameSettings.selectedArtifactIndex = artifactIndex
		}
	}
	/* ----------------------------SAVE/LOAD---------------------------- */

	/* ----------------------------ON-CHAIN FUNCTIONS---------------------------- */
	async getMockFighterNFTs() {
		// Mock function to simulate fetching Fighter NFTs
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockFighterNFTs), 1000)
		})
	}

	async getOwnedArtifactsAndDetails() {
		const userWalletAdress = gameSettings.userWalletAdress
		const address = userWalletAdress

		// console.log('Fetching artifacts for wallet:', address)
		// console.log('Current artifactDetails length:', this.artifactDetails.length)

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
				// console.log('Found owned objects:', ownedObjects.length)

				// Clear existing artifacts before adding new ones
				this.artifactDetails = []

				for (const obj of ownedObjects) {
					const objectId = obj?.data?.objectId
					if (objectId) {
						await this.getArtifactDetails(objectId)
					}
				}

				// console.log(
				// 	'Final artifactDetails length:',
				// 	this.artifactDetails.length,
				// )
			}
		} catch (error) {
			console.error('Error fetching owned objects:', error)
		}
	}

	async getArtifactDetails(objectId) {
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

			if (objectType && artifactCollectionIdentifiers.includes(objectType)) {
				const name = content?.name || display?.name
				const frame = content?.frame
				const ipfsUrl = display?.image_url || content?.url

				// Extract the path from IPFS URL (e.g., "/0/0.png" from full IPFS URL)
				const pathMatch = ipfsUrl.match(/\/(\d+\/\d+\.png)$/)
				const imagePath = pathMatch ? pathMatch[1] : null
				const imageUrl = imagePath ? `${R2_BASE_URL}/${imagePath}` : null
				// Construct R2 URL from extracted path
				const description = content?.description

				const attributes = content?.attributes?.fields || {}
				const attributesArray = Object.entries(attributes).map(
					([key, value]) => ({
						name: key.replace(/_/g, ' '),
						value: value,
					}),
				)

				if (content && imageUrl) {
					this.artifactDetails.push({
						name: name,
						url: imageUrl,
						frame: frame,
						description: description,
						attributes: attributesArray,
					})
				}
			}
		} catch (error) {
			console.error('Error fetching object details:', error)
		}
	}
	/* ----------------------------ON-CHAIN FUNCTIONS---------------------------- */

	/* ----------------------------HELPERS---------------------------- */
	truncateText(text, maxLength) {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...'
		}
		return text
	}

	preloadAllArtifactImages() {
		return new Promise((resolve) => {
			let loadedImages = 0
			const totalImages = this.artifactDetails.length

			if (totalImages === 0) {
				resolve()
				return
			}

			this.artifactDetails.forEach((artifact, index) => {
				this.loadIPFSImage(
					artifact.url,
					`item_image_${index + 1}`,
					96,
					96,
					() => {
						loadedImages++
						if (loadedImages === totalImages) {
							resolve()
						}
					},
				)
			})
		})
	}

	loadIPFSImage(url, key, width, height, onLoad) {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = url

		img.onload = () => {
			const canvas = document.createElement('canvas')
			canvas.width = width
			canvas.height = height
			const ctx = canvas.getContext('2d')
			ctx.drawImage(img, 0, 0, width, height)
			const resizedImage = canvas.toDataURL()

			this.textures.addBase64(key, resizedImage)
			if (onLoad) onLoad()
		}

		img.onerror = (error) => {
			console.error('Failed to load image from IPFS:', error)
			if (onLoad) onLoad() // Still call onLoad to prevent hanging
		}
	}

	checkAuth() {
		if (!gameSettings.userActive || !gameSettings.userWalletAdress) {
			console.log('User not authenticated, redirecting to boot game')
			if (this.sys.game.globals.bgMusic) {
				this.sys.game.globals.bgMusic.stop()
			}
			this.scene.stop('selectUtility')
			this.scene.start('bootGame')
			return false
		}
		return true
	}

	handleWalletConnected(data) {
		if (!data.connected) {
			if (this.sys.game.globals.bgMusic) {
				this.sys.game.globals.bgMusic.stop()
			}
			this.scene.start('bootGame')
		}
	}
	/* ----------------------------HELPERS---------------------------- */
}

export default SelectUtility
