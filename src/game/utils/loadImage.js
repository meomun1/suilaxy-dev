// filepath: /Users/nguyenluong/Developer/sui/suilaxy-dev/src/game/utils/loadImages.js
export const loadImageIfNotExists = (scene, key, path) => {
	if (!scene.textures.exists(key)) {
		scene.load.image(key, path)
	}
}

export const loadImageTitleScreen = (scene) => {
	loadImageIfNotExists(scene, 'background', 'assets/main-menu/background.png')
	loadImageIfNotExists(scene, 'button_play', 'assets/gui/button-play.png')
	loadImageIfNotExists(
		scene,
		'button_play_hover',
		'assets/gui/button-play-hover.png',
	)
}

export const loadImageMenu = (scene) => {
	loadImageIfNotExists(scene, 'background', 'assets/main-menu/background.png')
	loadImageIfNotExists(scene, 'logo', 'assets/main-menu/logo.png')
	loadImageIfNotExists(scene, 'donate-us', 'assets/main-menu/donate-us.png')
	loadImageIfNotExists(scene, 'gear-button', 'assets/main-menu/gear-button.png')
	loadImageIfNotExists(scene, 'arcade-card', 'assets/main-menu/arcade-card.png')
	loadImageIfNotExists(
		scene,
		'endless-card',
		'assets/main-menu/endless-card.png',
	)
	loadImageIfNotExists(scene, 'pvp-card', 'assets/main-menu/pvp-card.png')
	loadImageIfNotExists(
		scene,
		'next-mode-right',
		'assets/main-menu/next-mode-right.png',
	)
	loadImageIfNotExists(
		scene,
		'next-mode-left',
		'assets/main-menu/next-mode-left.png',
	)
}

export const loadImageLoading = (scene) => {
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
