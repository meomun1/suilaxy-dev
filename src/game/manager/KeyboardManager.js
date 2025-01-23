import Phaser from 'phaser'
import config from '../config/config'
import gameSettings from '../config/gameSettings'
import { shutdown } from '../utils/endGamescene'
import { resetSaveStatsToBaseStats } from '../utils/adjustStats'

class KeyboardManager {
	constructor(scene, music) {
		this.scene = scene
		this.music = music

		// Create A,W,S,D key
		this.cursorKeys = scene.input.keyboard.createCursorKeys()

		// Store the keys in a property
		this.keys = this.scene.input.keyboard.addKeys({
			spacebar: Phaser.Input.Keyboard.KeyCodes.SPACE,
			P: Phaser.Input.Keyboard.KeyCodes.P,
			T: Phaser.Input.Keyboard.KeyCodes.T,
			R: Phaser.Input.Keyboard.KeyCodes.R,
			L: Phaser.Input.Keyboard.KeyCodes.L,
			M: Phaser.Input.Keyboard.KeyCodes.M,
			// Add more keys as needed
		})
	}

	MuteGame() {
		this.keys.M.on(
			'down',
			() => {
				this.scene.music.soundOn = !this.scene.music.soundOn
				this.scene.music.musicOn = !this.scene.music.musicOn
				if (
					this.scene.music.musicOn === false &&
					this.scene.music.soundOn === false
				) {
					this.scene.sys.game.globals.bgMusic.pause()
					this.scene.music.bgMusicPlaying = false
				} else if (
					this.scene.music.musicOn === true &&
					this.scene.music.soundOn === true
				) {
					if (this.music.bgMusicPlaying === false) {
						this.scene.sys.game.globals.bgMusic.resume()
						this.scene.music.bgMusicPlaying = true
					}
				}
			},
			this,
		)
	}

	pauseGame() {
		// Access keys using this.keys.spacebar and this.keys.P
		if (Phaser.Input.Keyboard.JustDown(this.keys.P)) {
			// Assuming config.pauseGame is a global variable
			this.scene.scene.pause()
			this.scene.scene.launch('pauseScreen', {
				key: this.scene.callingScene,
			})
		}
	}

	unpauseGame() {
		this.keys.P.on('down', () => {
			this.scene.scene.resume(this.scene.callingScene)
			this.scene.scene.stop()
		})
	}

	menuScreen() {
		this.keys.T.on('down', () => {
			// reset stats
			resetSaveStatsToBaseStats()
			this.scene.scene.start('mainMenu')
			let otherScene = this.scene.scene.get(this.scene.callingScene)
			otherScene.events.once('shutdown', () => shutdown(otherScene), otherScene)
			this.scene.scene.stop(this.scene.callingScene)
			this.scene.scene.stop('pauseScreen')
			gameSettings.playerScore = 0
			this.scene.sys.game.globals.bgMusic.stop()
		})
	}
}

export default KeyboardManager
