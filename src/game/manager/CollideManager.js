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
		this.scene.scene.stop()
		this.scene.scene.start('createNft')
	}
}

export default CollideManager
