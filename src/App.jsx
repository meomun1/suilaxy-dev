import { useRef } from 'react'
import { PhaserGame } from './game/PhaserGame'
import {
	ConnectButton,
	useCurrentAccount,
	useSuiClientQuery,
} from '@mysten/dapp-kit'

function ConnectedAccount() {
	const account = useCurrentAccount()

	if (!account) {
		return null
	}

	return (
		<div>
			<div>Connected to {account.address}</div>
			<OwnedObjects address={account.address} />
		</div>
	)
}

function OwnedObjects(props) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: props.address,
	})
	if (!data) {
		return null
	}

	return (
		<ul>
			{data.data.map((object) => (
				<li key={object.data?.objectId}>
					<a
						href={`https://example-explorer.com/object/${object.data?.objectId}`}
					>
						{object.data?.objectId}
					</a>
				</li>
			))}
		</ul>
	)
}

function App() {
	//  References to the PhaserGame component (game and scene are exposed)
	const phaserRef = useRef()

	// Event emitted from the PhaserGame component
	const currentScene = (scene) => {
		console.log(scene)
	}

	return (
		<div id="app">
			{/* Game Info */}
			<div className="overlay"></div>
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
				<ConnectButton className="button" />
				<ConnectedAccount />
			</div>
		</div>
	)
}

export default App
