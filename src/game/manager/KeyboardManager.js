import Phaser from 'phaser'
import config from '../config/config'
import gameSettings from '../config/gameSettings'

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
			config.pauseGame = !config.pauseGame

			if (config.pauseGame == true) {
				this.scene.scene.launch('pauseScreen', {
					key: this.scene.callingScene,
				})
				this.scene.scene.pause()
			}
		}
	}

	unpauseGame() {
		this.keys.P.on('down', () => {
			config.pauseGame = false
			this.scene.scene.resume(this.scene.callingScene)
			this.scene.scene.stop()
		})
	}

	titleScreen() {
		this.keys.T.on('down', () => {
			this.scene.scene.start('bootGame')
			let otherScene = this.scene.scene.get(this.scene.callingScene)
			otherScene.shutdownPlayer()
			this.scene.scene.stop(this.scene.callingScene)
			this.scene.scene.stop('pauseScreen')
			gameSettings.playerScore = 0
			this.scene.sys.game.globals.bgMusic.stop()
		})
	}

	restartGame() {
		this.keys.R.on('down', () => {
			this.scene.scene.start(this.scene.callingScene)
			this.scene.scene.stop('gameOver')
		})
	}

	showLeaderboard() {
		this.keys.L.on('down', () => {
			this.scene.scene.start('leaderboard')
			this.scene.scene.stop('gameOver')
		})
	}
}

export default KeyboardManager
