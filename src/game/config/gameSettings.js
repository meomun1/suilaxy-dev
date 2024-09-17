var gameSettings = {
	// game settings

	// Speed, bullet damage, lifesteal, bullet speed, number of bullets, fire rate, bullet size, max health, size, armor, health generation, buff rate
	// There are 10 player upgrades in total
	playerSpeed: 250,
	playerBulletDamage: 5000,
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
	playerHardMode: false,

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
	nft_frame: 'nft_frame',
	nft_description: 'nft_description',
	nft_img_url: 'nft_img_url',

	// player settings
	selectedPlayerIndex: 1,
	selectedWeaponIndex: 1,
	userActive: false,
}

export default gameSettings
