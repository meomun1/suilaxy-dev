function handleWalletConnected(data) {
	if (!data.connected) {
		this.sys.game.globals.bgMusic.stop()
		this.scene.start('bootGame')
	}
}

export default handleWalletConnected
