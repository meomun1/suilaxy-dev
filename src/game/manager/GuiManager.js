import PlayingScreen from '../scenes/PlayingScreen'
import PauseScreen from '../scenes/PauseScreen'
import GameOver from '../scenes/GameOver'
import Phaser from 'phaser'
import config from '../config/config.js'

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

	// TEXT SESSION
	createSimpleText(x, y, key, font, color, origin) {
		const simpleText = this.scene.add.text(x, y, key, {
			fontFamily: 'Pixelify Sans',
			fontSize: font,
			fill: color,
		})
		simpleText.setOrigin(origin)
	}

	createMediumText(x, y, key, font, size, color, align, origin) {
		const chooseText = this.scene.add.text(x, y, key, {
			fontFamily: font,
			fontSize: size,
			color: color, // Set the color for "SPACE"
			align: align,
		})
		chooseText.setShadow(2, 2, '#F27CA4', 2, false, true)
		chooseText.setOrigin(origin)
	}

	createTextWithDelay(key, x, y, font, size, fill, origin, delay) {
		const simpleText = this.scene.add.text(x, y, key, {
			fontFamily: font,
			fontSize: size,
			fill: fill,
		})
		simpleText.setOrigin(origin)

		this.scene.time.delayedCall(
			delay,
			() => {
				simpleText.destroy()
			},
			null,
			this,
		)
	}

	createAnimatedText(text, yOffset) {
		const textObject = this.scene.add.text(
			config.width / 2,
			config.height / 2 + yOffset,
			text,
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '100px',
				color: '#F3F8FF',
				align: 'center',
			},
		)
		textObject.setOrigin(0.5)
		textObject.setShadow(3, 3, '#F27CA4', 2, false, true)

		this.scene.tweens.add({
			targets: textObject,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})
	}

	createAnimatedTextSize(text, yOffset, size) {
		const textObject = this.scene.add.text(
			config.width / 2,
			config.height / 2 + yOffset,
			text,
			{
				fontFamily: 'Pixelify Sans',
				fontSize: size,
				color: '#F3F8FF',
				align: 'center',
			},
		)
		textObject.setOrigin(0.5)
		textObject.setShadow(3, 3, '#F27CA4', 2, false, true)

		this.scene.tweens.add({
			targets: textObject,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})
	}

	createDelayDeleteSimpleText(x, y, key, font, color, origin, time) {
		const simpleText = this.scene.add.text(x, y, key, {
			fontFamily: 'Pixelify Sans',
			fontSize: font,
			fill: color,
		})
		simpleText.setOrigin(origin)

		this.scene.time.delayedCall(
			time,
			() => {
				simpleText.destroy()
			},
			null,
			this,
		)
	}

	createAnimatedTextSizeColor(text, yOffset, size, color) {
		const textObject = this.scene.add.text(
			config.width / 2,
			config.height / 2 + yOffset,
			text,
			{
				fontFamily: 'Pixelify Sans',
				fontSize: size,
				color: color,
				align: 'center',
			},
		)
		textObject.setOrigin(0.5)
		textObject.setShadow(3, 3, '#F27CA4', 2, false, true)

		this.scene.tweens.add({
			targets: textObject,
			duration: 1000,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			alpha: 0.2,
		})
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

	// SPRITE SESSION

	loadAudio(key, path) {
		this.scene.load.audio(key, path)
	}

	loadImage(key, path) {
		this.scene.load.image(key, path)
	}

	loadSpriteSheet(key, path, frameWidth, frameHeight, startFrame, endFrame) {
		this.scene.load.spritesheet(key, path, {
			frameWidth: frameWidth,
			frameHeight: frameHeight,
			startFrame: startFrame,
			endFrame: endFrame,
		})
	}
}

export default GuiManager
