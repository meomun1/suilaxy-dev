import Phaser from 'phaser'

class CreditsScene extends Phaser.Scene {
	constructor() {
		super('CreditsScene')
		this.callingScene = 'CreditsScene'
	}

	create() {
		this.music = this.sys.game.globals.music
		this.cameras.main.setBackgroundColor('#000') // Set the background color to black

		this.input.setDefaultCursor(
			'url(assets/cursors/custom-cursor.cur), pointer',
		)

		let creditsText = `
        SPACE GUARDIAN
        by FLY TEAM

        LEADER:
        Tien Phat

        MEMBERS:
        Minh Luong 
        Giang Nguyen 
        Tien Luan

        Special thanks for playing our game!!!
      `

		let text = this.add.text(0, this.cameras.main.height, creditsText, {
			color: '#fff',
			align: 'center',
			fontFamily: 'Pixelify Sans',
			fontSize: '32px',
		})
		text.x = this.cameras.main.width / 2 - text.width / 2 // Center the text

		this.time.addEvent({
			delay: 10000,
			callback: this.goToTitleScreen,
			callbackScope: this,
		})

		// Create a tween to move the text to the top of the screen
		this.tweens.add({
			targets: text,
			y: -text.height,
			duration: 10000, // 10 seconds
			ease: 'Linear',
		})

		this.hideTextInput()
	}

	hideTextInput() {
		const playerNameInput = document.getElementById('playerNameInput')
		playerNameInput.style.display = 'none'
	}

	goToTitleScreen() {
		this.sys.game.globals.bgMusic.stop()
		this.scene.start('bootGame')
	}
}
export default CreditsScene
