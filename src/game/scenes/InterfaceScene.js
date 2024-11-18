class InterfaceScene {
	constructor(scene) {
		this.scene = scene
	}

	transitionToScene(sceneKey, delay = 0) {
		this.scene.time.delayedCall(delay, () => {
			this.scene.scene.start(sceneKey)
		})
	}

	restartGame(delay = 0) {
		this.transitionToScene('playGame', delay)
	}

	goToLeaderboard(delay = 0) {
		this.transitionToScene('leaderboard', delay)
	}

	goToTitleScreen(delay = 0) {
		this.transitionToScene('bootGame', delay)
	}

	goToNFTGenerate(delay = 0) {
		this.transitionToScene('nftGenerate', delay)
	}

	goToNFTMint(delay = 0) {
		this.transitionToScene('mintingScreen', delay)
	}

	goToMainMenu(delay = 0) {
		this.transitionToScene('mainMenu', delay)
	}
}

export default InterfaceScene
