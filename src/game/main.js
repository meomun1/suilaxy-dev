import Phaser from 'phaser'
import TitleScreen from './scenes/TitleScreen.js'
import LoadingScreen from './scenes/LoadingScreen.js'
import LoadingPvPScreen from './scenes/LoadingPVPScreen.js'
import PlayingScreen from './scenes/PlayingScreen.js'
import ChooseRoomScreen from './scenes/ChooseRoomScreen.js'
import GameOver from './scenes/GameOver.js'
import PauseScreen from './scenes/PauseScreen.js'
import ChoosePlayer from './scenes/ChoosePlayer.js'
import ChoosePlayerPVP from './scenes/ChoosePlayerPVP.js'
import RoomPVPScreen from './scenes/RoomPVPScreen.js'
import UpgradeScreen from './scenes/UpgradeScreen.js'
import TutorialScreen from './scenes/TutorialScreen.js'
import LevelTwoScreen from './scenes/LevelTwoScreen.js'
import LevelThreeScreen from './scenes/LevelThreeScreen.js'
import BossScreen from './scenes/BossScreen.js'
import CreditScreen from './scenes/CreditScreen.js'
import NewShipScreen from './scenes/NewShipScreen.js'
import NftScreen from './scenes/NftScreen.js'
import PVPScreen from './scenes/PVPScreen.js'

// Temporary Disable
// import VictoryScreen from './scenes/VictoryScreen.js'
// import Leaderboard from './scenes/Leaderboard.js'

// test
const config = {
	type: Phaser.AUTO,
	width: 633,
	height: 950,
	parent: 'game-container',
	backgroundColor: 'rgba(0, 0, 0)',
	scene: [
		TitleScreen,
		LoadingScreen,
		LoadingPvPScreen,
		PlayingScreen,
		ChooseRoomScreen,
		ChoosePlayer,
		ChoosePlayerPVP,
		RoomPVPScreen,
		PVPScreen,
		TutorialScreen,
		LevelTwoScreen,
		NewShipScreen,
		LevelThreeScreen,
		BossScreen,
		PauseScreen,
		UpgradeScreen,
		GameOver,
		CreditScreen,
		NftScreen,
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
	dom: {
		createContainer: true,
	},
}

const StartGame = (parent) => {
	return new Phaser.Game({ ...config, parent })
}

export default StartGame
