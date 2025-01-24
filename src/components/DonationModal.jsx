import { useState } from 'react'
import PropTypes from 'prop-types'

import './DonationModal.css'

const DonationModal = ({ onClose, onDonate }) => {
	const [amount, setAmount] = useState('0.1')

	const handleSubmit = () => {
		const suiAmount = parseFloat(amount)
		if (isNaN(suiAmount) || suiAmount <= 0) {
			alert('Please enter a valid amount')
			return
		}
		const mistAmount = Math.floor(suiAmount * 1000000000)
		onDonate(mistAmount)
		onClose()
	}

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-overlay">
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					<h2 className="modal-title">DONATE US</h2>
					<p className="modal-description">
						&quot;Sincerely thank you for the support. It helps us a lot&quot; -
						from SUILAXY team
					</p>
					<div className="input-container">
						<div className="amount-input">
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="input-field"
								step="0.1"
								min="0.1"
							/>
							<button onClick={handleSubmit} className="donate-button">
								<svg
									className="water-drop"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 21C15.866 21 19 17.866 19 14C19 10.134 12 3 12 3C12 3 5 10.134 5 14C5 17.866 8.134 21 12 21Z"
										fill="currentColor"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DonationModal

DonationModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onDonate: PropTypes.func.isRequired,
}
