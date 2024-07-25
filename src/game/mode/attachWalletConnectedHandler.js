function handleWalletConnected(data) {
	if (!data.connected) {
		this.scene.start('bootGame')
	}
}

export default handleWalletConnected
