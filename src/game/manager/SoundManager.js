import Phaser from 'phaser'
class SoundManager extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene)
		this.scene = scene

		// Load your audio in the constructor
		this.loadAudio()
	}

	loadAudio() {
		this.scene.load.audio('health', 'assets/audio/health.wav')
		this.scene.load.audio('shield', 'assets/audio/shield.wav')
		this.scene.load.audio('shootSound', 'assets/audio/bullet.wav')
		this.scene.load.audio(
			'explosionSound',
			'assets/audio/DestroyEnemySmall.wav',
		)

		// Load other audio files here
	}

	playHealthSound() {
		if (this.scene.sys.game.globals.music.soundOn) {
			const healthSound = this.scene.sound.add('health', { volume: 0.1 })
			healthSound.play()
		}
	}

	playShieldSound() {
		if (this.scene.sys.game.globals.music.soundOn) {
			const shieldSound = this.scene.sound.add('shield', { volume: 0.1 })
			shieldSound.play()
		}
	}

	playBulletSound() {
		if (this.scene.sys.game.globals.music.soundOn) {
			const BulletSound = this.scene.sound.add('shootSound', { volume: 0.01 })
			BulletSound.play()
		}
	}

	playExplosionSound() {
		if (this.scene.sys.game.globals.music.soundOn) {
			const explosionSound = this.scene.sound.add('explosionSound', {
				volume: 0.01,
			})
			explosionSound.play()
		}
	}
	// Other sound functions...

	// You can add other audio management functions as needed
}

export default SoundManager
