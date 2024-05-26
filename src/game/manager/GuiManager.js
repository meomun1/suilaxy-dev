import config from '../config/config'
import PlayingScreen from '../scenes/PlayingScreen'
import PauseScreen from '../scenes/PauseScreen'
import GameOver from '../scenes/GameOver'

class GuiManager {
	constructor(scene) {
		this.scene = scene
		this.loadingSceneStarted = false
		this.createGui()
		this.TutorialText = null
	}

	createGui() {
		// Additional GUI elements specific to each scene
		if (this.scene instanceof PlayingScreen) {
			this.createPlayingGui()
		} else if (this.scene instanceof PauseScreen) {
			this.createPauseGui()
		} else if (this.scene instanceof GameOver) {
			this.createGameOverGui()
		}
	}

	createPlayingGui(backgroundKey) {
		this.createBackground(backgroundKey)
	}

	createPauseGui() {
		this.createSimpleText(
			config.width / 2,
			config.height / 2 - 50,
			'Pause',
			'32px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2,
			'Press P to Unpause',
			'24px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2 + 30,
			'Press T to TitleScreen',
			'24px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2 + 60,
			'Press M to Mute',
			'24px',
			'#fff',
			0.5,
		)
	}

	createGameOverGui() {
		this.createSimpleText(
			config.width / 2,
			config.height / 2 - 60,
			'Game Over',
			'32px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2,
			'Press R to Restart',
			'24px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2 + 30,
			'Press T back to title',
			'24px',
			'#fff',
			0.5,
		)

		this.createSimpleText(
			config.width / 2,
			config.height / 2 + 60,
			'Press L to Leaderboard',
			'24px',
			'#fff',
			0.5,
		)
	}

	createTitleGui() {
		// Add later
	}

	createSimpleText(x, y, key, font, color, origin) {
		const simpleText = this.scene.add.text(x, y, key, {
			fontFamily: 'Pixelify Sans',
			fontSize: font,
			fill: color,
		})
		simpleText.setOrigin(origin)
	}

	createBackground(key) {
		this.scene.background = this.scene.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			key,
		)
		this.scene.background.setOrigin(0, 0)
	}

	createLevelText(x, y, key, font, color) {
		const LevelText = this.scene.add.text(x, y, key, {
			fontFamily: 'Pixelify Sans',
			fontSize: font,
			fill: color,
		})
		LevelText.setOrigin(0.5)

		this.scene.time.delayedCall(
			4000,
			() => {
				LevelText.destroy()
			},
			null,
			this,
		)
	}

	createTutorialText(key, x, y) {
		const TutorialText = this.scene.add
			.text(x, y, key, {
				fontFamily: 'Pixelify Sans',
				fontSize: '28px',
				fill: '#ffffff',
			})
			.setOrigin(0.5)

		this.scene.time.delayedCall(
			4000,
			() => {
				TutorialText.destroy()
			},
			null,
			this,
		)
	}
}

export default GuiManager
