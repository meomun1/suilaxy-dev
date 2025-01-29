import gameSettings from '../../config/gameSettings'
import Player from './Player'

class SpecialPlayers extends Player {
	constructor(scene, x, y, key, health, selectedPlayerIndex) {
		super(scene, x, y, key, health)
		this.useSpecialAbility(selectedPlayerIndex)
	}

	useSpecialAbility(selectedPlayerIndex) {
		this.resetGameSettings()
		this.setDefaultAttributes()

		const abilities = {
			2: this.decreaseSizeIncreaseEnemySpeed,
			3: this.increaseSizeIncreaseHealth,
			4: this.enableHealthGeneration,
			5: this.increaseArmorDecreaseSpeed,
			6: this.enableLifeStealDecreaseHealth,
			7: this.increaseBuffEffect,
			8: this.decreaseEnemyBulletSpeedIncreaseSize,
			9: this.enableHardMode,
		}

		if (abilities[selectedPlayerIndex]) {
			abilities[selectedPlayerIndex].call(this)
		}
	}

	setDefaultAttributes() {
		this.setScale(1)
		this.maxHealth = gameSettings.savePlayerMaxHealth
		this.healthGeneration = 0.05
		this.playerArmor = gameSettings.savePlayerArmor
		this.lifestealRate = gameSettings.savePlayerLifesteal
		this.playerBuffRate = gameSettings.savePlayerBuffRate
		this.speed = gameSettings.savePlayerSpeed
		this.bulletDamage = gameSettings.savePlayerBulletDamage
		this.health = gameSettings.savePlayerMaxHealth
	}

	resetGameSettings() {
		gameSettings.enemySpeed = 200
		gameSettings.enemySize = 1
		gameSettings.bulletSpeed = 400
	}

	decreaseSizeIncreaseEnemySpeed() {
		this.setScale(0.75)
		gameSettings.enemySpeed = 250
	}

	increaseSizeIncreaseHealth() {
		this.setScale(1.5)
		this.maxHealth = gameSettings.savePlayerMaxHealth * 3
	}

	enableHealthGeneration() {
		this.healthGeneration = 0.1 + gameSettings.savePlayerHealthGeneration
	}

	increaseArmorDecreaseSpeed() {
		this.playerArmor = 20 + gameSettings.savePlayerArmor
		this.speed = gameSettings.savePlayerSpeed - 150
	}

	enableLifeStealDecreaseHealth() {
		this.lifestealRate = 0.5 + gameSettings.savePlayerLifesteal
		this.health = gameSettings.savePlayerMaxHealth * 0.5
	}

	increaseBuffEffect() {
		this.playerBuffRate = 1 + gameSettings.savePlayerBuffRate
	}

	decreaseEnemyBulletSpeedIncreaseSize() {
		gameSettings.bulletSpeed = 200
		gameSettings.enemySize = 2
	}

	enableHardMode() {
		this.health = 300
		this.bulletDamage = gameSettings.savePlayerBulletDamage * 2
	}
}

export default SpecialPlayers
