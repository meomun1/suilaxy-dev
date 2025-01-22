function handleWalletConnected(data) {
	if (!data.connected) {
		if (this.sys.game.globals.bgMusic) {
			this.sys.game.globals.bgMusic.stop()
		}

		// Clear textures and stop scene before switching
		for (let i = 1; i <= 1000; i++) {
			const textureKey = `item_image_${i}`
			if (this.textures.exists(textureKey)) {
				this.textures.remove(textureKey)
			}
		}

		this.artifactDetails = []
		this.scene.stop('selectUtility')
		this.scene.start('bootGame')
	}
}

export default handleWalletConnected
