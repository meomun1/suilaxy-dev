import axios from 'axios'

// https://66f3fc9a77b5e8897097cb44.mockapi.io/api/scores

export const postScore = async (user_address, score) => {
	try {
		await axios.post(
			'https://suilaxy-backend-616316054601.asia-southeast1.run.app/update-document',
			{
				user_address,
				score,
			},
		)
		console.log('Score posted successfully')
	} catch (error) {
		console.error('Error posting score:', error)
	}
}
