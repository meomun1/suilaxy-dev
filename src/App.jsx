import { useRef } from 'react'
import { PhaserGame } from './game/PhaserGame'
import {
	ConnectButton,
	useCurrentAccount,
	useSuiClientQuery,
} from '@mysten/dapp-kit'
import MintNFT from './sui/MintNFT'

function ConnectedAccount() {
	const account = useCurrentAccount()

	if (!account) {
		return null
	}

	return <OwnedObjects address={account.address} />
}

function OwnedObjects(props) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: props.address,
	})
	if (!data) {
		return null
	}
}

function App() {
	//  References to the PhaserGame component (game and scene are exposed)
	const phaserRef = useRef()

	// Event emitted from the PhaserGame component
	const currentScene = (scene) => {
		console.log(scene)
	}

	return (
		<>
			<div id="app">
				{/* Game Info */}
				<div className="child-left">
					<h1 className="h1">
						Currently Suilaxy is running with Beta version on Sui Blockchain
						testnet.
					</h1>
				</div>

				{/* Game Canvas */}
				<div className="child-main">
					<PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
				</div>

				{/* Connect Wallet + Other */}
				<div className="child-right">
					{/* <ConnectButton className="button" />
					<ConnectedAccount /> */}
					<MintNFT />
				</div>
			</div>
		</>
	)
}

export default App
