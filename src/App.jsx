import { useRef } from 'react'
import { PhaserGame } from './game/PhaserGame'
import {
	ConnectButton,
	useCurrentAccount,
	useSuiClientQuery,
} from '@mysten/dapp-kit'

function App() {
	//  References to the PhaserGame component (game and scene are exposed)
	const phaserRef = useRef()

	const changeScene = () => {
		const scene = phaserRef.current.scene

		if (scene) {
			scene.changeScene()
		}
	}

	// Event emitted from the PhaserGame component
	const currentScene = (scene) => {
		console.log(scene)
	}

	return (
		<div id="app">
			<PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
			<div>
				<div>
					<button className="button" onClick={changeScene}>
						Change Scene
					</button>
					<ConnectButton />
					<ConnectedAccount />
				</div>
			</div>
		</div>
	)
}

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

export default App
