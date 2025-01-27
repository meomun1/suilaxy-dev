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

	// Default player settings
	defaultPlayerSpeed: 250,
	defaultPlayerBulletDamage: 300,
	defaultPlayerLifesteal: 0,
	defaultPlayerBulletSpeed: 400,
	defaultPlayerScore: 0,
	defaultPlayerNumberOfBullets: 1,
	defaultPlayerFireRate: 1000,
	defaultPlayerDefaultBulletSize: 1.2,
	defaultPlayerBulletSize: 1.2,
	defaultPlayerMaxHealth: 1000,
	defaultPlayerUpgradeThreshold: 500,
	defaultPlayerSize: 1,
	defaultPlayerArmor: 0,
	defaultPlayerHealthGeneration: 0.1,
	defaultPlayerBuffRate: 1,
	defaultplayerHardMode: false,

	// // BASE STATS for player ( Can be used in fututre for reseting player stats)
	basePlayerSpeed: 250, // 250 - 750
	basePlayerBulletDamage: 300, // 300 - 1500
	basePlayerLifesteal: 0, // 0.1 - 0.5
	basePlayerBulletSpeed: 400, // 400-1000
	basePlayerScore: 0,
	basePlayerNumberOfBullets: 1, // 1 - 5
	basePlayerFireRate: 1000, // 500-1000
	basePlayerDefaultBulletSize: 1.2, // ko can
	basePlayerBulletSize: 1.2, // 1-3
	basePlayerMaxHealth: 1000, // 1000-5000
	basePlayerUpgradeThreshold: 500, // ko quan tam
	basePlayerSize: 1,
	basePlayerArmor: 0, // 10-150
	basePlayerHealthGeneration: 0.1, // 0.1 - 0.5
	basePlayerBuffRate: 1, // 1 - 5
	baseplayerHardMode: false, // ko quan tam

	// enemy settings
	// speed / bullet speed / health pack speed
	enemySpeed: 200,
	enemySize: 1,
	bulletSpeed: 400,
	healthPackSpeed: 100,
	bug1Damage: 200,
	bug3Damage: 200,
	bug5Damage: 300,
	enemyBulletDamage: 200,

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
