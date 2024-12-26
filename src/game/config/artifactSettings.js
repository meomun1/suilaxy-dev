export const ATTRIBUTE_SHORTHANDS = {
	speed: 'SPD',
	'max health': 'HP',
	armor: 'ARM',
	'bullet dmg': 'BDMG',
	'fire rate': 'FRAT',
	'bullet size': 'BSIZ',
	'buff rate': 'BUFF',
	lifesteal: 'LST',
	'health generation': 'GEN',
}

// Create the settings object
const artifactSettings = {
	attributeModifiers: {
		SPD: (currentValue, count) => currentValue + count * 10,
		DMG: (currentValue, count) => currentValue + count * 100,
		HP: (currentValue, count) => currentValue + count * 500,
		ARM: (currentValue, count) => currentValue + count * 5,
		BDMG: (currentValue, count) => currentValue + count * 200,
		FRAT: (currentValue, count) => Math.max(currentValue - count * 100, 100),
		BSIZ: (currentValue, count) => currentValue + count * 0.2,
		BUFF: (currentValue, count) => currentValue + count * 0.1,
		LST: (currentValue, count) => currentValue + count * 0.05,
		GEN: (currentValue, count) => currentValue + count * 2,
	},

	applyArtifactAttributes(gameSettings, artifact) {
		if (!artifact?.attributes) return gameSettings

		const modifiedSettings = {
			playerSpeed: gameSettings.playerSpeed,
			playerBulletDamage: gameSettings.playerBulletDamage,
			playerMaxHealth: gameSettings.playerMaxHealth,
			playerArmor: gameSettings.playerArmor,
			playerFireRate: gameSettings.playerFireRate,
			playerBulletSize: gameSettings.playerBulletSize,
			playerBuffRate: gameSettings.playerBuffRate,
			playerLifesteal: gameSettings.playerLifesteal,
			playerHealthGeneration: gameSettings.playerHealthGeneration,
		}

		artifact.attributes.forEach((attr) => {
			const shorthand = ATTRIBUTE_SHORTHANDS[attr.name]
			const modifier = this.attributeModifiers[shorthand]

			if (modifier) {
				switch (shorthand) {
					case 'SPD':
						modifiedSettings.playerSpeed = modifier(
							modifiedSettings.playerSpeed,
							attr.value,
						)
						break
					case 'DMG':
					case 'BDMG':
						modifiedSettings.playerBulletDamage = modifier(
							modifiedSettings.playerBulletDamage,
							attr.value,
						)
						break
					case 'HP':
						modifiedSettings.playerMaxHealth = modifier(
							modifiedSettings.playerMaxHealth,
							attr.value,
						)
						break
					case 'ARM':
						modifiedSettings.playerArmor = modifier(
							modifiedSettings.playerArmor,
							attr.value,
						)
						break
					case 'FRAT':
						modifiedSettings.playerFireRate = modifier(
							modifiedSettings.playerFireRate,
							attr.value,
						)
						break
					case 'BSIZ':
						modifiedSettings.playerBulletSize = modifier(
							modifiedSettings.playerBulletSize,
							attr.value,
						)
						break
					case 'BUFF':
						modifiedSettings.playerBuffRate = modifier(
							modifiedSettings.playerBuffRate,
							attr.value,
						)
						break
					case 'LST':
						modifiedSettings.playerLifesteal = modifier(
							modifiedSettings.playerLifesteal,
							attr.value,
						)
						break
					case 'GEN':
						modifiedSettings.playerHealthGeneration = modifier(
							modifiedSettings.playerHealthGeneration,
							attr.value,
						)
						break
				}
			}
		})

		return modifiedSettings
	},

	resetArtifactAttributes(gameSettings) {
		return {
			playerSpeed: gameSettings.savePlayerSpeed,
			playerBulletDamage: gameSettings.savePlayerBulletDamage,
			playerMaxHealth: gameSettings.savePlayerMaxHealth,
			playerArmor: gameSettings.savePlayerArmor,
			playerFireRate: gameSettings.savePlayerFireRate,
			playerBulletSize: gameSettings.savePlayerBulletSize,
			playerBuffRate: gameSettings.savePlayerBuffRate,
			playerLifesteal: gameSettings.savePlayerLifesteal,
			playerHealthGeneration: gameSettings.savePlayerHealthGeneration,
		}
	},
}

// Export the settings object as default
export default artifactSettings
