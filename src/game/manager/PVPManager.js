class PVPManager {
	constructor(scene, player1, player2, soundManager) {
		this.scene = scene
		this.player1 = player1
		this.player2 = player2

		// Add collision between bullets and enemies
		this.scene.physics.add.overlap(
			this.scene.projectiles,
			this.player2,
			this.bulletHitEnemy,
			null,
			this,
		)

		// Add collision between enemy bullets and player
		this.scene.physics.add.overlap(
			this.scene.projectiles2,
			this.player1,
			this.bulletHitPlayer,
			null,
			this,
		)

		// Add collision between player and enemies
		this.scene.physics.add.overlap(
			this.player1,
			this.player2,
			this.playerHitEnemy,
			null,
			this,
		)
	}

	bulletHitEnemy(player, bullet) {
		bullet.destroy()
		player.takeDamage(bullet.damage)
	}

	bulletHitPlayer(player, bullet) {
		bullet.destroy()
		player.takeDamage(bullet.damage)
	}

	playerHitEnemy(player1, player2) {
		player1.takeDamage(player2.damage)
		player2.takeDamage(player1.damage)
	}
}

export default PVPManager
