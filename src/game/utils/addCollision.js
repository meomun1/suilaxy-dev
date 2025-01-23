import CollideManager from '../manager/CollideManager.js'

export const addCollisionWithUtils = (scene, period, numHealth, numShield) => {
	scene.time.addEvent({
		delay: period,
		callback: () => {
			scene.UtilitiesManager.addUtilitiesForPlayingScreen(numHealth, numShield)
			scene.CollideManager1 = new CollideManager(
				scene,
				scene.player,
				scene.EnemyManager.enemies,
				scene.UtilitiesManager.HealthPacks,
				scene.UtilitiesManager.shieldPacks,
				scene.shield,
				scene.SoundManager,
			)
		},
		callbackScope: scene,
	})
}

export const addCollisionNormal = (scene) => {
	scene.CollideManager = new CollideManager(
		scene,
		scene.player,
		scene.EnemyManager.enemies,
		scene.UtilitiesManager.HealthPacks,
		scene.UtilitiesManager.shieldPacks,
		scene.shield,
		scene.SoundManager,
	)
}
