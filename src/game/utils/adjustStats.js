import gameSettings from '../config/gameSettings'

// setting = save
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

// save = setting
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
	gameSettings.basePlayerScore = gameSettings.defaultPlayerScore
	gameSettings.basePlayerNumberOfBullets =
		gameSettings.defaultPlayerNumberOfBullets
	gameSettings.basePlayerSize = gameSettings.defaultPlayerSize
	gameSettings.basePlayerBulletSpeed = gameSettings.defaultPlayerBulletSpeed
	gameSettings.basePlayerDefaultBulletSize =
		gameSettings.defaultPlayerDefaultBulletSize
	gameSettings.basePlayerUpgradeThreshold =
		gameSettings.defaultPlayerUpgradeThreshold
	gameSettings.baseplayerHardMode = gameSettings.defaultplayerHardMode
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
	gameSettings.basePlayerSpeed = gameSettings.defaultPlayerSpeed
	gameSettings.basePlayerBulletDamage = gameSettings.defaultPlayerBulletDamage
	gameSettings.basePlayerLifesteal = gameSettings.defaultPlayerLifesteal
	gameSettings.basePlayerBulletSpeed = gameSettings.defaultPlayerBulletSpeed
	gameSettings.basePlayerScore = gameSettings.defaultPlayerScore
	gameSettings.basePlayerNumberOfBullets =
		gameSettings.defaultPlayerNumberOfBullets
	gameSettings.basePlayerFireRate = gameSettings.defaultPlayerFireRate
	gameSettings.basePlayerDefaultBulletSize =
		gameSettings.defaultPlayerDefaultBulletSize
	gameSettings.basePlayerBulletSize = gameSettings.defaultPlayerBulletSize
	gameSettings.basePlayerMaxHealth = gameSettings.defaultPlayerMaxHealth
	gameSettings.basePlayerUpgradeThreshold =
		gameSettings.defaultPlayerUpgradeThreshold
	gameSettings.basePlayerSize = gameSettings.defaultPlayerSize
	gameSettings.basePlayerArmor = gameSettings.defaultPlayerArmor
	gameSettings.basePlayerHealthGeneration =
		gameSettings.defaultPlayerHealthGeneration
	gameSettings.basePlayerBuffRate = gameSettings
	gameSettings.baseplayerHardMode = gameSettings.defaultplayerHardMode
}

export const resetEverything = () => {
	resetBase() // base to default

	resetSaveStatsToBaseStats()

	resetFromMint()

	gameSettings.selectedPlayerIndex = 1
	gameSettings.selectedArtifactIndex = 1
	gameSettings.userActive = false

	gameSettings.userWalletAdress = ''
}

export const resetFromMint = () => {
	gameSettings.isBossDead = true
	gameSettings.nft_id = 0
	gameSettings.nft_hastag = 0
	gameSettings.nft_weapon = 'nft_weapon'
	gameSettings.nft_weapon_index = 0
	gameSettings.nft_frame = 'nft_frame'
	gameSettings.nft_frame_index = 0
	gameSettings.nft_description = 'nft_description'
	gameSettings.nft_img_url = 'nft_img_url'
}
