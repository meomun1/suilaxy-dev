import gameSettings from '../config/gameSettings'

class UpgradeManager {
	constructor(scene, callingScene) {
		this.scene = scene
		this.callingScene = callingScene
		this.createScoreText()

		if (this.callingScene === 'playGame') {
			this.upgradeScore = 1500
		}

		if (this.callingScene === 'playLevelTwo') {
			this.upgradeScore = 2000
		}

		if (this.callingScene === 'playLevelThree') {
			this.upgradeScore = 2500
		}

		if (this.callingScene === 'bossGame') {
			this.upgradeScore = 3000
		}
	}

	createScoreText() {
		this.scoreText = this.scene.add.text(
			10,
			10,
			`Score: ${gameSettings.playerScore}`,
			{
				fontFamily: 'Pixelify Sans',
				fontSize: '32px',
				fill: '#fff',
			},
		)
	}

	updateScore(score) {
		gameSettings.playerScore += score

		this.displayScore()

		if (gameSettings.playerScore % this.upgradeScore === 0) {
			if (this.scene.mobileManager.isMobile == true) {
				this.scene.mobileManager.isMobile = false
			}
			this.rewardByScore(this.callingScene)
			if (this.scene.sys.game.device.os.desktop == true) {
				this.scene.mobileManager.isMobile = true
			}
			gameSettings.playerUpgradeThreshold += 100
		}
	}

	rewardByScore(callingScene) {
		this.scene.input.setDragState(this.scene.player, 0)
		// Pause the current scene
		this.scene.scene.pause()
		// Launch upgradeScreen and pass the sceneName as part of the data
		this.scene.scene.launch('upgradeScreen', { callingScene: callingScene })
	}

	displayScore() {
		this.scoreText.setText(`Score: ${gameSettings.playerScore}`)
		this.scoreText.setDepth(3)
	}
}

export default UpgradeManager
