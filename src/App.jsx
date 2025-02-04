import { useRef, useState, useEffect } from 'react'
import { PhaserGame } from './game/PhaserGame'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import SuiLoginUI from './sui/SuiLoginUI'
import DonationModal from './components/DonationModal'
import { EventBus } from './game/EventBus'
import { MobileSite } from './MobileSite'
import { useMediaQuery } from 'react-responsive'

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
	const [showDonationModal, setShowDonationModal] = useState(false)
	const isMobile = useMediaQuery({ query: '(max-width: 1200px)' })

	useEffect(() => {
		const handleDonateClick = () => {
			setShowDonationModal(true)
			EventBus.emit('donation-modal-opened')
		}

		EventBus.on('donate-clicked', handleDonateClick)
		return () => EventBus.off('donate-clicked', handleDonateClick)
	}, [])

	const handleCloseModal = () => {
		setShowDonationModal(false)
		EventBus.emit('donation-modal-closed')
	}

	const handleDonate = (mistAmount) => {
		EventBus.emit('process-donation', { amount: mistAmount })
	}

	const onCurrentActiveScene = (scene) => {}

	return (
		<>
			{isMobile ? (
				<MobileSite />
			) : (
				<>
					<div id="app">
						<div className="container">
							<div className="top">
								<div className="top-logo">
									<h1 className="special-text">SUILAXY</h1>
								</div>
								<div className="top-desc">
									<h1>Suilaxy, Beta version on Sui testnet.</h1>
									<h1>Visit our Gitbook page for info.</h1>
									<a
										href="https://suilaxy.gitbook.io/suilaxy"
										target="_blank"
										rel="noreferrer"
									>
										https://suilaxy.gitbook.io/suilaxy
									</a>
								</div>
								<div className="top-connect">
									<SuiLoginUI />
								</div>
							</div>
							<div className="game-canvas">
								<PhaserGame
									ref={phaserRef}
									currentActiveScene={onCurrentActiveScene}
								/>
							</div>
						</div>
					</div>
					{showDonationModal && (
						<DonationModal
							onClose={handleCloseModal}
							onDonate={(amount) => {
								handleDonate(amount)
								if (phaserRef.current?.scene) {
									phaserRef.current.scene.resume('mainMenu')
								}
							}}
						/>
					)}
				</>
			)}
		</>
	)
}
export default App
