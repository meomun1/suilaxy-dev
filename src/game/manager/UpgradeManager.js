import gameSettings from '../config/gameSettings'

class UpgradeManager {
	constructor(scene, callingScene) {
		this.scene = scene
		this.callingScene = callingScene
		this.createScoreText()
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

		const playerUpgradeThreshold = this.countScoreByThreshhold(
			gameSettings.playerUpgradeThreshold,
		)

		if (
			gameSettings.playerScore ===
			this.countScoreByThreshhold(gameSettings.playerUpgradeThreshold)
		) {
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

	countScoreByThreshhold(threshhold) {
		return threshhold ** 2 / 200 + threshhold / 2 - 300
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
