// filepath: /Users/nguyenluong/Developer/sui/suilaxy-dev/src/game/utils/loadImages.js
export const loadImageIfNotExists = (scene, key, path) => {
	if (!scene.textures.exists(key)) {
		scene.load.image(key, path)
	}
}

export const loadImages = (scene) => {
	loadImageIfNotExists(
		scene,
		'background_texture',
		'assets/images/backgrounds/purple/nebula_1.png',
	)
	loadImageIfNotExists(
		scene,
		'background_texture_01',
		'assets/images/backgrounds/green/nebula_6.png',
	)
	loadImageIfNotExists(
		scene,
		'background_texture_02',
		'assets/images/backgrounds/blue/nebula_2.png',
	)
	loadImageIfNotExists(
		scene,
		'background_texture_03',
		'assets/images/backgrounds/purple/nebula_3.png',
	)
	loadImageIfNotExists(
		scene,
		'background_texture_04',
		'assets/images/backgrounds/blue/redbula_1.png',
	)
}

export const loadImageLevelTwo = (scene) => {
	scene.load.image('asteroid_1', 'assets/images/asteroid/asteroid_01.png')
	scene.load.image('asteroid_2', 'assets/images/asteroid/asteroid_02.png')
	scene.load.image('asteroid_3', 'assets/images/asteroid/asteroid_03.png')
	scene.load.image('asteroid_4', 'assets/images/asteroid/asteroid_04.png')
}
