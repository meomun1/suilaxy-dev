export const loadSpriteSheetIfNotExists = (
	scene,
	key,
	path,
	frameWidth,
	frameHeight,
	margin,
	spacing,
) => {
	if (!scene.textures.exists(key)) {
		scene.guiManager.loadSpriteSheet(
			key,
			path,
			frameWidth,
			frameHeight,
			margin,
			spacing,
		)
	}
}

export const loadPlayerSpriteSheetNormal = (scene) => {
	scene.load.spritesheet({
		key: `player_texture_${scene.selectedPlayerIndex}`,
		url: `assets/spritesheets/players/planes_0${scene.selectedPlayerIndex}A.png`,
		frameConfig: {
			frameWidth: 96,
			frameHeight: 96,
			startFrame: 0,
			endFrame: 19,
		},
	})
}

// Load common spritesheets
export const loadSpriteSheets = (scene) => {
	loadSpriteSheetIfNotExists(
		scene,
		'boss_texture',
		'assets/spritesheets/enemies/boss-01.png',
		240,
		240,
		0,
		7,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'mini_texture',
		'assets/spritesheets/enemies/support-bot.png',
		96,
		96,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'bug1_texture',
		'assets/spritesheets/enemies/bug_1.png',
		64,
		64,
		0,
		5,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'bug3_texture',
		'assets/spritesheets/enemies/bug_3.png',
		64,
		64,
		0,
		5,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'bug5_texture',
		'assets/spritesheets/enemies/bug_5.png',
		64,
		64,
		0,
		5,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'healthPack_texture',
		'assets/spritesheets/vfx/healthPack.png',
		32,
		32,
		0,
		4,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'healthBar_texture',
		'assets/spritesheets/vfx/healthbar-scaled.png',
		331,
		154,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'pauseDis_texture',
		'assets/spritesheets/vfx/pauseDis.png',
		36,
		36,
		0,
		1,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'settingButton_texture',
		'assets/spritesheets/vfx/settingButton.png',
		36,
		36,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'mute_texture',
		'assets/spritesheets/vfx/mute.png',
		36,
		36,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'sound_texture',
		'assets/spritesheets/vfx/sound.png',
		36,
		36,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'settingHover_texture',
		'assets/spritesheets/vfx/settingHover.png',
		36,
		36,
		0,
		0,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'shieldPack_texture',
		'assets/spritesheets/vfx/shieldPack.png',
		32,
		32,
		0,
		4,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'shield_texture',
		'assets/spritesheets/vfx/shield.png',
		96,
		96,
		0,
		5,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'bulletChase_texture',
		'assets/spritesheets/vfx/chaseBullet_01.png',
		64,
		64,
		0,
		16,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'bullet_texture',
		'assets/spritesheets/vfx/bullet.png',
		12,
		26,
		0,
		2,
	)
	loadSpriteSheetIfNotExists(
		scene,
		'explosion_texture',
		'assets/spritesheets/vfx/explosion.png',
		100,
		100,
		0,
		11,
	)
}

const bulletSprites = {
	1: {
		key: 'bullet1_texture',
		path: 'assets/spritesheets/vfx/bullet1.png',
		frameWidth: 32,
		frameHeight: 11,
		margin: 0,
		spacing: 1,
	},
	2: {
		key: 'bullet2_texture',
		path: 'assets/spritesheets/vfx/bullet2.png',
		frameWidth: 25,
		frameHeight: 33,
		margin: 0,
		spacing: 5,
	},
	3: {
		key: 'bullet3_texture',
		path: 'assets/spritesheets/vfx/bullet3.png',
		frameWidth: 20,
		frameHeight: 32,
		margin: 0,
		spacing: 4,
	},
	4: {
		key: 'bullet4_texture',
		path: 'assets/spritesheets/vfx/bullet4.png',
		frameWidth: 22,
		frameHeight: 22,
		margin: 0,
		spacing: 5,
	},
	5: {
		key: 'bullet5_texture',
		path: 'assets/spritesheets/vfx/bullet5.png',
		frameWidth: 20,
		frameHeight: 39,
		margin: 0,
		spacing: 3,
	},
	6: {
		key: 'bullet6_texture',
		path: 'assets/spritesheets/vfx/bullet6.png',
		frameWidth: 15,
		frameHeight: 25,
		margin: 0,
		spacing: 2,
	},
	7: {
		key: 'bullet7_texture',
		path: 'assets/spritesheets/vfx/bullet7.png',
		frameWidth: 20,
		frameHeight: 30,
		margin: 0,
		spacing: 3,
	},
	8: {
		key: 'bullet8_texture',
		path: 'assets/spritesheets/vfx/bullet8.png',
		frameWidth: 30,
		frameHeight: 30,
		margin: 0,
		spacing: 5,
	},
	9: {
		key: 'bullet9_texture',
		path: 'assets/spritesheets/vfx/bullet9.png',
		frameWidth: 20,
		frameHeight: 30,
		margin: 0,
		spacing: 3,
	},
}

const effectSprites = {
	1: {
		key: 'effect1_texture',
		path: 'assets/spritesheets/effects/effect_10.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 59,
	},
	2: {
		key: 'effect2_texture',
		path: 'assets/spritesheets/effects/effect_2.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 27,
	},
	3: {
		key: 'effect3_texture',
		path: 'assets/spritesheets/effects/effect_3.png',
		frameWidth: 100,
		frameHeight: 100,
		margin: 0,
		spacing: 19,
	},
	4: {
		key: 'effect4_texture',
		path: 'assets/spritesheets/effects/effect_4.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 12,
	},
	5: {
		key: 'effect5_texture',
		path: 'assets/spritesheets/effects/effect_5.png',
		frameWidth: 72,
		frameHeight: 72,
		margin: 0,
		spacing: 15,
	},
	6: {
		key: 'effect6_texture',
		path: 'assets/spritesheets/effects/effect_6.png',
		frameWidth: 265,
		frameHeight: 265,
		margin: 0,
		spacing: 29,
	},
	7: {
		key: 'effect7_texture',
		path: 'assets/spritesheets/effects/effect_7.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 65,
	},
	8: {
		key: 'effect8_texture',
		path: 'assets/spritesheets/effects/effect_8.png',
		frameWidth: 413,
		frameHeight: 369,
		margin: 0,
		spacing: 29,
	},
	9: {
		key: 'effect9_texture',
		path: 'assets/spritesheets/effects/effect_9.png',
		frameWidth: 299,
		frameHeight: 313,
		margin: 0,
		spacing: 29,
	},
}

const additionalEffectSprites = [
	{
		key: 'bounce_effect_texture',
		path: 'assets/spritesheets/effects/bounce_effect.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 41,
	},
	{
		key: 'electric_effect_texture',
		path: 'assets/spritesheets/effects/electric_effect.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 41,
	},
	{
		key: 'time_effect_texture',
		path: 'assets/spritesheets/effects/time_effect.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 45,
	},
	{
		key: 'poison_effect_texture',
		path: 'assets/spritesheets/effects/poison_effect.png',
		frameWidth: 64,
		frameHeight: 64,
		margin: 0,
		spacing: 41,
	},
]

export { bulletSprites, effectSprites, additionalEffectSprites }
