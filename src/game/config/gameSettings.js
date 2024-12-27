var gameSettings = {
	// game settings

	// Speed, bullet damage, lifesteal, bullet speed, number of bullets, fire rate, bullet size, max health, size, armor, health generation, buff rate
	// There are 10 player upgrades in total

	// MODIFY STATS with artifacts/upgrades/or fighter selection
	playerSpeed: 250, // original 250
	playerBulletDamage: 5000, // original 100
	playerLifesteal: 0,
	playerBulletSpeed: 400,
	playerScore: 0,
	playerNumberOfBullets: 1,
	playerFireRate: 1500,
	playerDefaultBulletSize: 1.2,
	playerBulletSize: 1.2,
	playerMaxHealth: 5000,
	playerUpgradeThreshold: 300,
	playerSize: 1,
	playerArmor: 0,
	playerHealthGeneration: 0,
	playerBuffRate: 1,
	playerHardMode: false,

	// SAVE STATS player in levels
	savePlayerSpeed: 250,
	savePlayerBulletDamage: 5000,
	savePlayerLifesteal: 0,
	savePlayerBulletSpeed: 400,
	savePlayerScore: 0,
	savePlayerNumberOfBullets: 1,
	savePlayerFireRate: 1500,
	savePlayerDefaultBulletSize: 1.2,
	savePlayerBulletSize: 1.2,
	savePlayerMaxHealth: 5000,
	savePlayerUpgradeThreshold: 500,
	savePlayerSize: 1,
	savePlayerArmor: 0,
	savePlayerHealthGeneration: 0,
	savePlayerBuffRate: 1,
	saveplayerHardMode: false,

	// BASE STATS for player
	basePlayerSpeed: 250,
	basePlayerBulletDamage: 5000,
	basePlayerLifesteal: 0,
	basePlayerBulletSpeed: 400,
	basePlayerScore: 0,
	basePlayerNumberOfBullets: 1,
	basePlayerFireRate: 1500,
	basePlayerDefaultBulletSize: 1.2,
	basePlayerBulletSize: 1.2,
	basePlayerMaxHealth: 5000,
	basePlayerUpgradeThreshold: 500,
	basePlayerSize: 1,
	basePlayerArmor: 0,
	basePlayerHealthGeneration: 0,
	basePlayerBuffRate: 1,
	baseplayerHardMode: false,

	// enemy settings
	// speed / bullet speed / health pack speed
	enemySpeed: 200,
	enemySize: 1,
	bulletSpeed: 400,
	healthPackSpeed: 100,

	// boss settings
	isBossDead: true,
	nft_id: 0,
	nft_hastag: 0,
	nft_weapon: 'nft_weapon',
	nft_weapon_index: 0,
	nft_frame: 'nft_frame',
	nft_frame_index: 0,
	nft_description: 'nft_description',
	nft_img_url: 'nft_img_url',

	// player settings
	selectedPlayerIndex: 1,
	selectedArtifactIndex: 1,
	userActive: false,
	userWalletAdress: '',

	// Method to update settings with modified values
	updateWithModifiedSettings(modifiedSettings) {
		Object.assign(this, modifiedSettings)
	},
}

export default gameSettings
