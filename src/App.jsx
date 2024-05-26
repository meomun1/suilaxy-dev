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
		<div id="app" className="parent">
			{/* Game Info */}
			<div className="child heading">
				<h1 className="heading-h1">
					Currently Suilaxy is running with Beta version on Sui Blockchain
					testnet.
				</h1>
			</div>

			{/* Game Canvas */}
			<div className="child">
				<PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
			</div>

			{/* Connect Wallet + Other */}
			<div className="child">
				<ConnectButton
					style={{
						display: 'block',
						backgroundColor: '#4E97F3',
						color: 'white',
						padding: '15px',
						textAlign: 'center',
						textDecoration: 'none',
						display: 'inline-block',
						fontSize: '16px',
						margin: '4px 2px',
						cursor: 'pointer',
						borderRadius: '15px',
					}}
				/>
				<ConnectedAccount
					style={{
						textAlign: 'center',
						color: '#4E97F3',
					}}
				/>
			</div>
		</div>
	)
}

export default App
