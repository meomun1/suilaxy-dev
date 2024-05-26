import Phaser from 'phaser'
import config from '../config/config'
import Bug1 from '../objects/enemies/Bug1'
import Bug3 from '../objects/enemies/Bug3'
import Bug5 from '../objects/enemies/Bug5'

class EnemyManager {
	constructor(scene) {
		this.scene = scene
		this.enemies = []
		this.respawnDelays = []
		this.lastRespawnTimes = []
		this.gameStarted = false

		// Set initial random delays and times for each enemy
		for (let i = 0; i < this.enemies.length; i++) {
			this.respawnDelays[i] = Phaser.Math.Between(2000, 5000)
			this.lastRespawnTimes[i] = 0
		}
	}

	checkToFinishLevel() {
		// Check if all enemies are inactive
		const allEnemiesInactive = this.enemies.every((enemy) => !enemy.active)
		// If all enemies are inactive and the game has started, return true
		if (allEnemiesInactive && this.gameStarted) {
			return true
		}
		// Otherwise, return false
		return false
	}

	destroyEnemyMoveOutOfScreen() {
		let offScreenEnemyIndex = this.enemies.findIndex(
			(enemy) => enemy.y >= config.height + 350 || enemy.y < -350,
		)
		if (offScreenEnemyIndex !== -1) {
			// this.enemies[offScreenEnemyIndex].hpBar.destroy();
			this.enemies[offScreenEnemyIndex].destroy() // call destroy directly
			this.enemies.splice(offScreenEnemyIndex, 1) // remove the enemy from the array
		}
	}

	moveEnemies(time) {
		// Move enemies

		let offScreenEnemy = this.enemies.find((enemy) => enemy.y >= config.height)
		let offScreenEnemyIndex = this.enemies.findIndex(
			(enemy) => enemy.y >= config.height,
		)

		const currentTime = this.scene.time.now

		// Check if enough time has passed for the next respawn for this specific enemy
		if (
			currentTime - this.lastRespawnTimes[offScreenEnemyIndex] >=
			this.respawnDelays[offScreenEnemyIndex]
		) {
			offScreenEnemy.y = 0
			offScreenEnemy.x = Phaser.Math.Between(120, config.width - 120)

			// Set a new random delay for the next respawn for this specific enemy
			this.respawnDelays[offScreenEnemyIndex] = Phaser.Math.Between(2000, 4000)
			this.lastRespawnTimes[offScreenEnemyIndex] = currentTime
		}
	}

	// this can make the enemies respawn
	addEnemy(enemy) {
		// When adding a new enemy, initialize its random delay and last respawn time
		this.enemies.push(enemy)
		this.respawnDelays.push(Phaser.Math.Between(5000, 7000))
		this.lastRespawnTimes.push(0)
	}

	addEnemyForOnce(enemy) {
		this.enemies.push(enemy)
	}

	spawnSingleEnemy(type, x, y, health, scale = 1) {
		let newEnemy

		switch (type) {
			case 1:
				newEnemy = new Bug1(this.scene, x, y, health, scale)
				newEnemy.play('bug1_anim')
				break
			case 3:
				newEnemy = new Bug3(this.scene, x, y, health, scale)
				newEnemy.play('bug3_anim')
				break
			case 5:
				newEnemy = new Bug5(this.scene, x, y, health, scale)
				newEnemy.play('bug5_anim')
				break
			// Add more cases for other enemy types if needed

			default:
				// Default case, spawn Bug1 if the type is not recognized
				newEnemy = new Bug1(this.scene, x, y, health)
				newEnemy.play('bug1_anim')
				break
		}
		this.enemies.push(newEnemy)
		return newEnemy
	}

	spawnEnemyRow(rowX, numRows, gapSize, health) {
		const enemies = []

		for (let i = 0; i < numRows; i++) {
			const x = rowX + i * (50 + gapSize)
			const y = -20

			const newEnemy = this.spawnSingleEnemy(1, x, y, health)
			enemies.push(newEnemy)
		}

		return enemies
	}

	// FOR TUTORIAL SCREEN
	addEnemyTutorial() {
		this.spawnSingleEnemy(1, config.width / 2, -20, 300)
	}

	// FOR LEVEL 1
	spawnCircleOfBugsLv1(centerX, centerY, radius, numBugs) {
		const angleIncrement = (2 * Math.PI) / numBugs

		for (let i = 0; i < numBugs; i++) {
			const angle = i * angleIncrement
			const bugX = centerX + radius * Math.cos(angle)
			const bugY = centerY + radius * Math.sin(angle)

			// Create a new bug
			const newBug = new Bug1(this.scene, bugX, -20, 300)
			newBug.play('bug1_anim')
			this.addEnemyForOnce(newBug)

			// Add a tween to move the bug downward
			this.scene.tweens.add({
				targets: newBug,
				y: bugY,
				duration: 5000,
				ease: 'Linear',
			})
		}
	}

	spawnEnemyRowWithDelay(scene, delay, health) {
		if (health === undefined) {
			health = 300
		}
		scene.time.delayedCall(
			delay,
			() => {
				const enemyRow = scene.EnemyManager.spawnEnemyRow(30, 8, 40, health)
			},
			null,
			scene,
		)
	}

	// FOR LEVEL 3
	spawnBugRain(numBugs, speed, spawnInterval) {
		let count = 0
		const spawn = () => {
			if (count >= numBugs) {
				clearInterval(intervalId) // Stop spawning new bugs
				return
			}

			const x = Phaser.Math.Between(0, config.width)
			const y = -20

			// Create a new bug
			const newBug = new Bug1(this.scene, x, y, 600)
			newBug.play('bug1_anim')
			this.addEnemyForOnce(newBug)

			this.scene.tweens.add({
				targets: newBug,
				y: config.height + 20,
				duration: speed,
				ease: 'Linear',
			})

			count++
		}

		const intervalId = setInterval(spawn, spawnInterval)
	}

	spawnBugRainRightToLeft(numBugs, speed, spawnInterval) {
		let count = 0
		const spawn = () => {
			if (count >= numBugs) {
				clearInterval(intervalId) // Stop spawning new bugs
				return
			}

			const x = config.width + 20 // Start the bug off the right edge of the screen
			const y = Phaser.Math.Between(0, config.height / 3)

			// Create a new bug
			const newBug = new Bug1(this.scene, x, y, 600)
			newBug.play('bug1_anim')
			newBug.angle = 45
			this.addEnemyForOnce(newBug)

			// Add a tween to move the bug to the left
			this.scene.tweens.add({
				targets: newBug,
				x: -20, // Move the bug beyond the left edge of the screen
				duration: speed,
				ease: 'Linear',
			})

			count++
		}

		const intervalId = setInterval(spawn, spawnInterval)
	}

	spawnBugRainLeftToRight(numBugs, speed, spawnInterval) {
		let count = 0
		const spawn = () => {
			if (count >= numBugs) {
				clearInterval(intervalId) // Stop spawning new bugs
				return
			}

			const x = -20
			const y = Phaser.Math.Between(0, config.height / 3)

			// Create a new bug
			const newBug = new Bug1(this.scene, x, y, 600)
			newBug.play('bug1_anim')
			newBug.angle = -45
			this.addEnemyForOnce(newBug)

			// Add a tween to move the bug to the right
			this.scene.tweens.add({
				targets: newBug,
				x: config.width + 20, // Move the bug beyond the right edge of the screen
				duration: speed,
				ease: 'Linear',
			})

			count++
		}

		const intervalId = setInterval(spawn, spawnInterval)
	}

	spawnBugRainBottomToTop(numBugs, speed, spawnInterval) {
		let count = 0
		const spawn = () => {
			if (count >= numBugs) {
				clearInterval(intervalId) // Stop spawning new bugs
				return
			}

			const x = Phaser.Math.Between(0, config.width)
			const y = config.height + 20 // Start the bug off the bottom edge of the screen

			// Create a new bug
			const newBug = new Bug1(this.scene, x, y, 600)
			newBug.play('bug1_anim')
			newBug.angle = -180 // Make the bug face upwards
			this.addEnemyForOnce(newBug)

			// Add a tween to move the bug to the top
			this.scene.tweens.add({
				targets: newBug,
				y: -20, // Move the bug beyond the top edge of the screen
				duration: speed,
				ease: 'Linear',
				onComplete: () => {
					newBug.angle = 0
				},
			})

			count++
		}

		const intervalId = setInterval(spawn, spawnInterval)
	}

	// FOR BOSS
	spawnParticle(x, y) {
		let particle = this.scene.add.circle(x, y, 5, 0xffffff) // Create a white circle as a particle

		this.scene.tweens.add({
			targets: particle,
			x: Phaser.Math.Between(x - 100, x + 100), // Random end x within 100 pixels of the start x
			y: Phaser.Math.Between(y - 100, y + 100), // Random end y within 100 pixels of the start y
			alpha: 0, // Fade out
			scale: 0, // Shrink
			duration: 1000, // Duration of 1 second
			ease: 'Cubic.easeIn', // Slow start
			onComplete: () => particle.destroy(), // Destroy the particle at the end of the tween
		})
	}

	createFirework(x, y) {
		for (let i = 0; i < 50; i++) {
			// Create 50 particles
			this.spawnParticle(x, y)
		}
	}
}

export default EnemyManager
