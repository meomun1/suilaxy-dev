import { useRef } from 'react'
import { PhaserGame } from './game/PhaserGame'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import MintNFT from './sui/MintNFT'

// eslint-disable-next-line no-unused-vars
function ConnectedAccount() {
	const account = useCurrentAccount()

	if (!account) {
		return null
	}

	return <OwnedObjects address={account.address} />
}

import PropTypes from 'prop-types'

function OwnedObjects(props) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: props.address,
	})
	if (!data) {
		return null
	}
}

OwnedObjects.propTypes = {
	address: PropTypes.string.isRequired,
}

function App() {
	const phaserRef = useRef()

	const onCurrentActiveScene = (scene) => {
		console.log(scene)
	}

	return (
		<>
			<div id="app">
				<div className="child-left">
					<div className="text-wrapper">
						<div className="top">
							<h1 className="special-text">SUILAXY</h1>
						</div>
					</div>
					<div className="text-wrapper">
						<div className="bottom">
							<h1>
								Currently Suilaxy is running with Beta version on Sui Blockchain
								testnet.
							</h1>
							<h1 className="h1-two">
								For more information, please visit our Gitbook page.
							</h1>
							<a
								href="https://suilaxy.gitbook.io/suilaxy"
								target="_blank"
								rel="noreferrer"
							>
								https://suilaxy.gitbook.io/suilaxy
							</a>
						</div>
					</div>
				</div>

				<div className="child-main">
					<PhaserGame
						ref={phaserRef}
						currentActiveScene={onCurrentActiveScene}
					/>
				</div>

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
