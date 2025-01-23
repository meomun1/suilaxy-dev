// filepath: /Users/nguyenluong/Developer/sui/suilaxy-dev/src/game/utils/loadAudio.js
export const loadAudio = (scene) => {
	scene.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
	scene.load.audio('shootSound', 'assets/audio/bullet.wav')
	scene.load.audio('main_menu_music', 'assets/audio/backgroundMusic.mp3')
	scene.load.audio('health', 'assets/audio/health.wav')
	scene.load.audio('shield', 'assets/audio/shield.wav')
	scene.load.audio('bossMusic', 'assets/audio/boss.mp3')
}

export const loadAudioPlayingScreen = (scene) => {
	scene.load.image('pause', 'assets/spritesheets/vfx/pause.png')
	scene.load.audio('desertMusic', 'assets/audio/playingMusic.mp3')
	scene.load.audio('explosionSound', 'assets/audio/DestroyEnemySmall.wav')
	scene.load.audio('shootSound', 'assets/audio/bullet.wav')
}
