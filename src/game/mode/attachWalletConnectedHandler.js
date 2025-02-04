import { resetEverything } from '../utils/adjustStats'
import { shutdown } from '../utils/endGamescene'
import MenuScreen from '../scenes/MenuScreen'
import SelectUtility from '../scenes/SelectUtility'
import TitleScreen from '../scenes/TitleScreen'

function handleWalletConnected(data) {
	if (!data.connected) {
		if (this.sys.game.globals.bgMusic) {
			this.sys.game.globals.bgMusic.stop()
		}
		if (this instanceof SelectUtility) {
			// Clear textures and stop scene before switching
			for (let i = 1; i <= 1000; i++) {
				const textureKey = `item_image_${i}`
				if (this.textures.exists(textureKey)) {
					this.textures.remove(textureKey)
				}
			}

			this.artifactDetails = []
		}

		if (this instanceof MenuScreen) {
			this.events.once('shutdown', () => shutdown(this), this)
		}

		if (this instanceof TitleScreen) {
			this.scene.stop(this.callingScene)
		}

		this.scene.stop(this.callingScene)

		this.scene.start('bootGame')

		resetEverything()
	}
}

export default handleWalletConnected
