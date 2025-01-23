import Bullet from '../objects/projectiles/Bullet.js'
import EnemyBullet from '../objects/projectiles/EnemyBullet.js'
import ChasingBullet from '../objects/projectiles/ChasingBullet.js'
import PVPBullet from '../objects/projectiles/PVPBulletPlayer.js'
import config from '../config/config.js'
import ShieldCover from '../objects/projectiles/ShieldCover.js'
import WingCover from '../objects/projectiles/WingCover.js'
import RandomBullet from '../objects/projectiles/RandomBullet.js'
import Effect from '../objects/projectiles/Effect.js'
import EnemyEffect from '../objects/projectiles/EnemyEffects.js'

class ProjectileManager {
	constructor(scene) {
		this.scene = scene
	}

	createEnemyEffect() {
		this.scene.projectilesEnemyEffects = this.scene.physics.add.group({
			classType: EnemyEffect,
			runChildUpdate: true,
		})
	}

	createRandomBullet() {
		this.scene.projectiles = this.scene.physics.add.group({
			classType: RandomBullet,
			runChildUpdate: true,
		})
	}

	createShieldCover() {
		this.scene.projectiles = this.scene.physics.add.group({
			classType: ShieldCover,
			runChildUpdate: true,
		})
	}

	createWingCover() {
		this.scene.projectiles = this.scene.physics.add.group({
			classType: WingCover,
			runChildUpdate: true,
		})
	}

	createPlayerBullet() {
		this.scene.projectiles = this.scene.physics.add.group({
			classType: Bullet,
			runChildUpdate: true,
		})
	}

	createEffect() {
		this.scene.projectilesEffects = this.scene.physics.add.group({
			classType: Effect,
			runChildUpdate: true,
		})
	}

	createPVPBulletPlayer(player) {
		this.scene.pvpProjectiles1 = this.scene.physics.add.group({
			classType: PVPBullet,
			runChildUpdate: true,
		})
	}

	createPVPBulletOpponent(opponent) {
		this.scene.pvpProjectiles2 = this.scene.physics.add.group({
			classType: PVPBullet,
			runChildUpdate: true,
		})
	}

	createEnemyBullet() {
		this.scene.enemyProjectiles = this.scene.physics.add.group({
			classType: EnemyBullet,
			runChildUpdate: true,
		})
	}

	createChaseBullet() {
		this.scene.chaseProjectiles = this.scene.physics.add.group({
			classType: ChasingBullet,
			runChildUpdate: true,
		})
	}

	callEnemyBulletLv1() {
		this.scene.time.addEvent({
			delay: 1000, // 1000 milliseconds = 1 second
			callback: () => {
				this.scene.bug3_1.shootBullet(this.scene, this.scene.bug3_1)
				this.scene.bug3_2.shootBullet(this.scene, this.scene.bug3_2)
			},
			loop: true, // This makes the event repeat indefinitely
		})
	}

	callChaseBulletLv1() {
		this.scene.time.addEvent({
			delay: 3000, // 1000 milliseconds = 1 second
			callback: () => {
				this.scene.bug3_3.shootChaseBullet(this.scene, this.scene.bug3_3)
			},
			loop: true, // This makes the event repeat indefinitely
		})
	}

	callEnemyBulletLv2() {
		this.scene.time.addEvent({
			delay: 750, // 1000 milliseconds = 1 second
			callback: () => {
				this.scene.miniBoss.shootChaseBullet(this.scene, this.scene.miniBoss)
				this.scene.bug3_2.shootBoundBullet(this.scene, this.scene.bug3_2)
				this.scene.bug3_4.shootBoundBullet(this.scene, this.scene.bug3_4)
			},
			loop: true, // This makes the event repeat indefinitely
		})
	}

	callEnemyBulletBoss() {
		this.scene.time.addEvent({
			delay: 1000, // 1000 milliseconds = 1 second
			callback: () => {
				this.scene.bug3_1.shootBullet(this.scene, this.scene.bug3_1)

				if (this.scene.firstMini.y > config.height / 2) {
					this.scene.firstMini.shootBullet(this.scene, this.scene.firstMini)
				}

				if (this.scene.secondMini.y > config.height / 2) {
					this.scene.secondMini.shootBullet(this.scene, this.scene.secondMini)
				}
			},
			loop: true, // This makes the event repeat indefinitely
		})
	}

	callChaseBulletBoss() {
		this.scene.time.addEvent({
			delay: 3000, // 1000 milliseconds = 1 second
			callback: () => {
				this.scene.bug3_2.shootChaseBullet(this.scene, this.scene.bug3_2)
			},
			loop: true, // This makes the event repeat indefinitely
		})
	}
}

export default ProjectileManager
