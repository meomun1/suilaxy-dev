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
		SPD: (currentValue, count) => currentValue + count * 50,
		DMG: (currentValue, count) => currentValue + count * 100,
		HP: (currentValue, count) => currentValue + count * 500,
		ARM: (currentValue, count) => currentValue + count * 15,
		BDMG: (currentValue, count) => currentValue + count * 150,
		FRAT: (currentValue, count) => Math.max(currentValue - count * 100, 100),
		BSIZ: (currentValue, count) => currentValue + count * 0.2,
		BUFF: (currentValue, count) => {
			currentValue = Number(currentValue) || 1
			count = Number(count) || 0
			return currentValue + count * 0.5
		},
		LST: (currentValue, count) => currentValue + count * 0.05,
		GEN: (currentValue, count) => currentValue + count * 0.05,
	},

	applyArtifactAttributes(gameSettings, artifact) {
		if (!artifact?.attributes) return gameSettings

		const modifiedSettings = {
			basePlayerSpeed: gameSettings.basePlayerSpeed,
			basePlayerBulletDamage: gameSettings.basePlayerBulletDamage,
			basePlayerMaxHealth: gameSettings.basePlayerMaxHealth,
			basePlayerArmor: gameSettings.basePlayerArmor,
			basePlayerFireRate: gameSettings.basePlayerFireRate,
			basePlayerBulletSize: gameSettings.basePlayerBulletSize,
			basePlayerBuffRate: gameSettings.basePlayerBuffRate,
			basePlayerLifesteal: gameSettings.basePlayerLifesteal,
			basePlayerHealthGeneration: gameSettings.basePlayerHealthGeneration,
		}

		artifact.attributes.forEach((attr) => {
			const shorthand = ATTRIBUTE_SHORTHANDS[attr.name]
			const modifier = this.attributeModifiers[shorthand]

			if (modifier) {
				switch (shorthand) {
					case 'SPD':
						modifiedSettings.basePlayerSpeed = modifier(
							modifiedSettings.basePlayerSpeed,
							attr.value,
						)
						break
					case 'DMG':
					case 'BDMG':
						modifiedSettings.basePlayerBulletDamage = modifier(
							modifiedSettings.basePlayerBulletDamage,
							attr.value,
						)
						break
					case 'HP':
						modifiedSettings.basePlayerMaxHealth = modifier(
							modifiedSettings.basePlayerMaxHealth,
							attr.value,
						)
						break
					case 'ARM':
						modifiedSettings.basePlayerArmor = modifier(
							modifiedSettings.basePlayerArmor,
							attr.value,
						)
						break
					case 'FRAT':
						modifiedSettings.basePlayerFireRate = modifier(
							modifiedSettings.basePlayerFireRate,
							attr.value,
						)
						break
					case 'BSIZ':
						modifiedSettings.basePlayerBulletSize = modifier(
							modifiedSettings.basePlayerBulletSize,
							attr.value,
						)
						break
					case 'BUFF':
						modifiedSettings.basePlayerBuffRate = Math.round(
							modifier(modifiedSettings.basePlayerBuffRate, attr.value),
						)
						break
					case 'LST':
						modifiedSettings.basePlayerLifesteal = modifier(
							modifiedSettings.basePlayerLifesteal,
							attr.value,
						)
						break
					case 'GEN':
						modifiedSettings.basePlayerHealthGeneration = modifier(
							modifiedSettings.basePlayerHealthGeneration,
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
