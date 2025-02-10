import Phaser from 'phaser'
import TitleScreen from './scenes/TitleScreen.js'
import LoadingScreen from './scenes/LoadingScreen.js'
import PlayingScreen from './scenes/PlayingScreen.js'
import ChooseRoomScreen from './scenes/ChooseRoomScreen.js'
import GameOver from './scenes/GameOver.js'
import PauseScreen from './scenes/PauseScreen.js'
import UpgradeScreen from './scenes/UpgradeScreen.js'
import TutorialScreen from './scenes/TutorialScreen.js'
import LevelTwoScreen from './scenes/LevelTwoScreen.js'
import LevelThreeScreen from './scenes/LevelThreeScreen.js'
import BossScreen from './scenes/BossScreen.js'
import CreditScreen from './scenes/CreditScreen.js'
import NewShipScreen from './scenes/NewShipScreen.js'
import MintingScreen from './scenes/MintingScreen.js'
import PowerScreen from './scenes/PowerScreen.js'
import MenuScreen from './scenes/MenuScreen.js'
import SelectUtility from './scenes/SelectUtility.js'
import NFTGenerate from './scenes/NFTGenerate.js'
import Leaderboard from './scenes/Leaderboard.js'
import PVPScreen from './scenes/PVP/PVPScreen.js'
import LoadingPvPScreen from './scenes/PVP/LoadingPVPScreen.js'
import ChoosePlayerPVP from './scenes/PVP/ChoosePlayerPVP.js'
import RoomPVPScreen from './scenes/PVP/RoomPVPScreen.js'
// import TestScene from './scenes/TestScene.js'

const config = {
	type: Phaser.AUTO,
	parent: 'game-container',
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 'rgba(0, 0, 0)',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [
		TitleScreen,
		MenuScreen,
		LoadingScreen,
		LoadingPvPScreen,
		SelectUtility,
		PlayingScreen,
		ChooseRoomScreen,
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
		PowerScreen,
		GameOver,
		CreditScreen,
		NFTGenerate,
		MintingScreen,
		Leaderboard,
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

const StartGame = (containerId) => {
	const gameConfig = { ...config, parent: containerId }
	return new Phaser.Game(gameConfig)
}

export default StartGame
