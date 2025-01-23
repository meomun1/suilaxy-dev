import gameSettings from '../config/gameSettings'

// This will apply stats to game from save stats
export const gameStats = () => {
	gameSettings.playerSpeed = gameSettings.savePlayerSpeed
	gameSettings.playerBulletDamage = gameSettings.savePlayerBulletDamage
	gameSettings.playerLifesteal = gameSettings.savePlayerLifesteal
	gameSettings.playerBulletSpeed = gameSettings.savePlayerBulletSpeed
	gameSettings.playerScore = gameSettings.savePlayerScore
	gameSettings.playerNumberOfBullets = gameSettings.savePlayerNumberOfBullets
	gameSettings.playerFireRate = gameSettings.savePlayerFireRate
	gameSettings.playerDefaultBulletSize =
		gameSettings.savePlayerDefaultBulletSize
	gameSettings.playerBulletSize = gameSettings.savePlayerBulletSize
	gameSettings.playerUpgradeThreshold = gameSettings.savePlayerUpgradeThreshold
	gameSettings.playerSize = gameSettings.savePlayerSize
	gameSettings.playerArmor = gameSettings.savePlayerArmor
	gameSettings.playerHealthGeneration = gameSettings.savePlayerHealthGeneration
	gameSettings.playerBuffRate = gameSettings.savePlayerBuffRate
}

// This will save stats after each game
export const saveStats = (player) => {
	gameSettings.savePlayerSpeed = player.speed
	gameSettings.savePlayerBulletDamage = player.bulletDamage
	gameSettings.savePlayerLifesteal = player.lifestealRate
	gameSettings.savePlayerBulletSpeed = player.bulletSpeed
	gameSettings.savePlayerScore = gameSettings.playerScore
	gameSettings.savePlayerNumberOfBullets = player.numberOfBullets
	gameSettings.savePlayerFireRate = player.fireRate
	gameSettings.savePlayerDefaultBulletSize =
		gameSettings.playerDefaultBulletSize
	gameSettings.savePlayerBulletSize = player.bulletSize
	gameSettings.savePlayerMaxHealth = player.maxHealth
	gameSettings.savePlayerUpgradeThreshold = gameSettings.playerUpgradeThreshold
	gameSettings.savePlayerSize = player.playerSize
	gameSettings.savePlayerArmor = player.playerArmor
	gameSettings.savePlayerBuffRate = player.playerBuffRate
	gameSettings.savePlayerHealthGeneration = player.healthGeneration
}

// This will save base stats after pick Ship and NFT
export const saveBaseStats = (base) => {
	// Modify
	gameSettings.basePlayerSpeed = base.basePlayerSpeed //
	gameSettings.basePlayerBulletDamage = base.basePlayerBulletDamage //
	gameSettings.basePlayerLifesteal = base.basePlayerLifesteal //
	gameSettings.basePlayerFireRate = base.basePlayerFireRate //
	gameSettings.basePlayerBulletSize = base.basePlayerBulletSize //
	gameSettings.basePlayerMaxHealth = base.basePlayerMaxHealth //
	gameSettings.basePlayerArmor = base.basePlayerArmor //
	gameSettings.basePlayerHealthGeneration = base.basePlayerHealthGeneration //
	gameSettings.basePlayerBuffRate = base.basePlayerBuffRate //

	// Default
	gameSettings.basePlayerScore = 0
	gameSettings.basePlayerNumberOfBullets = 1
	gameSettings.basePlayerSize = 1
	gameSettings.basePlayerBulletSpeed = 250
	gameSettings.basePlayerDefaultBulletSize = 1.2
	gameSettings.basePlayerUpgradeThreshold = 500
	gameSettings.baseplayerHardMode = false
}

// This will set save stats to base stats
export const resetSaveStatsToBaseStats = () => {
	gameSettings.savePlayerSpeed = gameSettings.basePlayerSpeed
	gameSettings.savePlayerBulletDamage = gameSettings.basePlayerBulletDamage
	gameSettings.savePlayerLifesteal = gameSettings.basePlayerLifesteal
	gameSettings.savePlayerBulletSpeed = gameSettings.basePlayerBulletSpeed
	gameSettings.savePlayerScore = gameSettings.basePlayerScore
	gameSettings.savePlayerNumberOfBullets =
		gameSettings.basePlayerNumberOfBullets
	gameSettings.savePlayerFireRate = gameSettings.basePlayerFireRate
	gameSettings.savePlayerDefaultBulletSize =
		gameSettings.basePlayerDefaultBulletSize
	gameSettings.savePlayerBulletSize = gameSettings.basePlayerBulletSize
	gameSettings.savePlayerMaxHealth = gameSettings.basePlayerMaxHealth
	gameSettings.savePlayerUpgradeThreshold =
		gameSettings.basePlayerUpgradeThreshold
	gameSettings.savePlayerSize = gameSettings.basePlayerSize
	gameSettings.savePlayerArmor = gameSettings.basePlayerArmor
	gameSettings.savePlayerHealthGeneration =
		gameSettings.basePlayerHealthGeneration
	gameSettings.savePlayerBuffRate = gameSettings.basePlayerBuffRate
	gameSettings.saveplayerHardMode = gameSettings.baseplayerHardMode
}

export const resetBase = () => {
	gameSettings.basePlayerSpeed = 250
	gameSettings.basePlayerBulletDamage = 5000
	gameSettings.basePlayerLifesteal = 0
	gameSettings.basePlayerBulletSpeed = 400
	gameSettings.basePlayerScore = 0
	gameSettings.basePlayerNumberOfBullets = 1
	gameSettings.basePlayerFireRate = 1500
	gameSettings.basePlayerDefaultBulletSize = 1.2
	gameSettings.basePlayerBulletSize = 1.2
	gameSettings.basePlayerMaxHealth = 5000
	gameSettings.basePlayerUpgradeThreshold = 500
	gameSettings.basePlayerSize = 1
	gameSettings.basePlayerArmor = 0
	gameSettings.basePlayerHealthGeneration = 0
	gameSettings.basePlayerBuffRate = 1
	gameSettings.baseplayerHardMode = false
}

export const resetEverything = () => {
	gameSettings.basePlayerSpeed = 250
	gameSettings.basePlayerBulletDamage = 5000
	gameSettings.basePlayerLifesteal = 0
	gameSettings.basePlayerBulletSpeed = 400
	gameSettings.basePlayerScore = 0
	gameSettings.basePlayerNumberOfBullets = 1
	gameSettings.basePlayerFireRate = 1500
	gameSettings.basePlayerDefaultBulletSize = 1.2
	gameSettings.basePlayerBulletSize = 1.2
	gameSettings.basePlayerMaxHealth = 5000
	gameSettings.basePlayerUpgradeThreshold = 500
	gameSettings.basePlayerSize = 1
	gameSettings.basePlayerArmor = 0
	gameSettings.basePlayerHealthGeneration = 0
	gameSettings.basePlayerBuffRate = 1
	gameSettings.baseplayerHardMode = false

	resetSaveStatsToBaseStats()

	gameSettings.isBossDead = true
	gameSettings.nft_id = 0
	gameSettings.nft_hastag = 0
	gameSettings.nft_weapon = 'nft_weapon'
	gameSettings.nft_weapon_index = 0
	gameSettings.nft_frame = 'nft_frame'
	gameSettings.nft_frame_index = 0
	gameSettings.nft_description = 'nft_description'
	gameSettings.nft_img_url = 'nft_img_url'

	gameSettings.selectedPlayerIndex = 1
	gameSettings.selectedArtifactIndex = 1
	gameSettings.userActive = false

	gameSettings.userWalletAdress = ''
}
