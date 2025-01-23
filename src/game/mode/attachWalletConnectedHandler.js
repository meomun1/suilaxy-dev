import { resetEverything } from '../utils/adjustStats'
import { shutdown } from '../utils/endGamescene'
import MenuScreen from '../scenes/MenuScreen'

function handleWalletConnected(data) {
	if (!data.connected) {
		if (this.sys.game.globals.bgMusic) {
			this.sys.game.globals.bgMusic.stop()
		}
		this.scene.stop(this.callingScene)
		if (this instanceof MenuScreen) {
			this.events.once('shutdown', () => shutdown(this), this)
		}
		this.scene.start('bootGame')
		resetEverything()
	}
}

export default handleWalletConnected
