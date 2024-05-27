import gameSettings from '../config/gameSettings'

class CollideManager {
	constructor(
		scene,
		player,
		enemies,
		healthPacks,
		shieldPacks,
		nftCollection,
		shield,
		soundManager,
	) {
		this.scene = scene
		this.player = player
		this.enemies = enemies
		this.healthPacks = healthPacks
		this.shieldPacks = shieldPacks
		this.nftCollection = nftCollection
		this.shield = shield
		this.shieldActive = false
		this.soundManager = soundManager

		// Add collision between bullets and enemies
		this.scene.physics.add.overlap(
			this.scene.projectiles,
			this.enemies,
			this.bulletHitEnemy,
			null,
			this,
		)

		// Add collision between player having shield and enemies
		this.scene.physics.add.overlap(
			this.shield,
			this.enemies,
			this.shieldCollideEnemy,
			null,
			this,
		)

		// Add collision between player having shield and bullet
		this.scene.physics.add.overlap(
			this.scene.enemyProjectiles,
			this.shield,
			this.shieldCollideBullet,
			null,
			this,
		)

		// Add collision between enemy bullets and player
		this.scene.physics.add.overlap(
			this.scene.enemyProjectiles,
			this.player,
			this.bulletHitPlayer,
			null,
			this,
		)

		// Add collision between player and enemies
		this.scene.physics.add.overlap(
			this.player,
			this.enemies,
			this.playerHitEnemy,
			null,
			this,
		)


		// Add collision between player and nft collections
		this.scene.physics.add.overlap(
			this.player,
			this.nftCollection,
			this.playerCollideNftCollection,
			null,
			this,
		)

		// Add collision between player and health packs
		this.healthPacks.forEach((healthPack) => {
			this.scene.physics.add.overlap(
				this.player,
				healthPack,
				this.playerCollideHealthPack,
				null,
				this,
			)
		})

		// Add collision between player and shield packs
		this.shieldPacks.forEach((shieldPack) => {
			this.scene.physics.add.overlap(
				this.player,
				shieldPack,
				this.playerCollideShieldPack,
				null,
				this,
			)
		})
	}

	shieldCollideEnemy(shield, enemy) {
		if (this.shieldActive) {
			enemy.takeDamage(100)
			shield.hide()
			this.shieldActive = false
		}
	}

	shieldCollideBullet(shield, enemyBullet) {
		if (this.shieldActive) {
			enemyBullet.destroy()
			shield.hide()
			this.shieldActive = false
		}
	}

	bulletHitEnemy(enemy, bullet) {
		bullet.destroy()
		enemy.takeDamage(bullet.damage)
	}

	bulletHitPlayer(player, enemyBullet) {
		enemyBullet.destroy()
		player.takeDamage(enemyBullet.damage)
	}

	playerHitEnemy(player, enemy) {
		player.takeDamage(enemy.damage)
		enemy.takeDamage(player.damage)
	}

	playerCollideHealthPack(player, healthPack) {
		this.soundManager.playHealthSound()
		const healthAmount = 400
		player.getHeal(healthAmount)
		healthPack.destroy()
	}

	playerCollideShieldPack(player, shieldPack) {
		this.soundManager.playShieldSound()
		shieldPack.destroy()
		this.shield.show()
		this.shieldActive = true
	}

	playerCollideNftCollection(player, nftCollection) {
		nftCollection.destroy()
		
		const arrayFrame = ['bronze', 'silver', 'gold', 'emerald', 'diamond', 'master', 'grandmaster', 'challenger', 'legendary']

		const randomNum = Math.random() * 100;

		let item;
		if (randomNum < 0.01) {
			item = arrayFrame[8]; // 'legendary'
		} else if (randomNum < 0.1) {
			item = arrayFrame[7]; // 'challenger'
		} else if (randomNum < 1) {
			item = arrayFrame[6]; // 'grandmaster'
		} else if (randomNum < 5) {
			item = arrayFrame[5]; // 'master'
		} else if (randomNum < 10) {
			item = arrayFrame[4]; // 'diamond'
		} else if (randomNum < 20) {
			item = arrayFrame[3]; // 'emerald'
		} else if (randomNum < 30) {
			item = arrayFrame[2]; // 'gold'
		} else if (randomNum < 50) {
			item = arrayFrame[1]; // 'silver'
		} else {
			item = arrayFrame[0]; // 'bronze'
		}

		gameSettings.nft_frame = item;
		gameSettings.nft_weapon = 'weapon';

		
		console.log(gameSettings.nft_frame + ' ' + gameSettings.nft_weapon)
	}
}

export default CollideManager
