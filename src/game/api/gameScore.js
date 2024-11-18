import axios from 'axios'

export const postScore = async (score, walletAddress) => {
	try {
		await axios.post('https://66f3fc9a77b5e8897097cb44.mockapi.io/api/scores', {
			score,
			walletAddress,
		})
		console.log('Score posted successfully')
	} catch (error) {
		console.error('Error posting score:', error)
	}
}
