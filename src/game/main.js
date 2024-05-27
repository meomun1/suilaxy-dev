import Phaser from 'phaser'

import TitleScreen from './scenes/TitleScreen.js'
import LoadingScreen from './scenes/LoadingScreen.js'
import PlayingScreen from './scenes/PlayingScreen.js'
import GameOver from './scenes/GameOver.js'
import PauseScreen from './scenes/PauseScreen.js'
import ChoosePlayer from './scenes/ChoosePlayer.js'
import UpgradeScreen from './scenes/UpgradeScreen.js'
import TutorialScreen from './scenes/TutorialScreen.js'
import LevelTwoScreen from './scenes/LevelTwoScreen.js'
import LevelThreeScreen from './scenes/LevelThreeScreen.js'
import BossScreen from './scenes/BossScreen.js'
import CreditScreen from './scenes/CreditScreen.js'
import NewShipScreen from './scenes/NewShipScreen.js'

// Temporary Disable
import VictoryScreen from './scenes/VictoryScreen.js'
import Leaderboard from './scenes/Leaderboard.js'

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
	type: Phaser.AUTO,
	width: 600,
	height: 850,
	parent: 'game-container',
	backgroundColor: '#028af8',
	scene: [
		TitleScreen,
		LoadingScreen,
		PlayingScreen,
		ChoosePlayer,
		TutorialScreen,
		LevelTwoScreen,
		NewShipScreen,
		LevelThreeScreen,
		BossScreen,
		PauseScreen,
		UpgradeScreen,
		GameOver,
		CreditScreen,
	],
	pixelArt: true,
	input: {
		keyboard: true,
		mouse: true,
		touch: true,
		activePointers: 3,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
		},
	},
	plugins: {
		scene: [
			{
				key: 'InputPlugin',
				plugin: Phaser.Input.InputPlugin,
				mapping: 'input',
			},
		],
	},
}

const StartGame = (parent) => {
	return new Phaser.Game({ ...config, parent })
}

export default StartGame
