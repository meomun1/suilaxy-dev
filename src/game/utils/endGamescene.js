import Phaser from 'phaser'
import { saveStats } from './adjustStats'
import gameSettings from '../config/gameSettings'

export const gameOver = (scene) => {
	scene.events.once('shutdown', () => shutdown(scene), scene)
	scene.scene.stop()
	scene.scene.stop('upgradeScreen')
	scene.scene.start('gameOver', { key: scene.callingScene })
}

export const shutdown = (scene) => {
	// Remove entire texture along with all animations
	if (
		scene.textures.exists(`player_texture_${gameSettings.selectedPlayerIndex}`)
	) {
		scene.textures.remove(`player_texture_${gameSettings.selectedPlayerIndex}`)
	}

	// Check if the animation exists before trying to remove it
	if (scene.anims && scene.anims.exists && scene.anims.exists('player_anim')) {
		scene.anims.remove('player_anim')
	}
	if (
		scene.anims &&
		scene.anims.exists &&
		scene.anims.exists('player_anim_left')
	) {
		scene.anims.remove('player_anim_left')
	}
	if (
		scene.anims &&
		scene.anims.exists &&
		scene.anims.exists('player_anim_left_diagonal')
	) {
		scene.anims.remove('player_anim_left_diagonal')
	}
	if (
		scene.anims &&
		scene.anims.exists &&
		scene.anims.exists('player_anim_right')
	) {
		scene.anims.remove('player_anim_right')
	}
	if (
		scene.anims &&
		scene.anims.exists &&
		scene.anims.exists('player_anim_right_diagonal')
	) {
		scene.anims.remove('player_anim_right_diagonal')
	}
}

export const handleEnterKey = (scene) => {
	scene.scene.stop('upgradeScreen')
	saveStats(scene.player)
	scene.time.delayedCall(1000, () => {
		scene.cameras.main.fadeOut(1000, 0, 0, 0)

		scene.cameras.main.once(
			Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
			(cam, effect) => {
				scene.scene.stop()
				scene.scene.start('powerScreen', {
					number: scene.selectedPlayerIndex,
					callingScene: scene.callingScene,
				})
			},
		)
	})
}
