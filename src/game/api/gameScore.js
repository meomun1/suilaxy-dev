import axios from 'axios'

export const postScore = async (user_address, score) => {
	try {
		await axios.post(
			'https://suilaxy-backend-616316054601.asia-southeast1.run.app/update-document',
			{
				user_address,
				score,
			},
		)
	} catch (error) {
		console.error('Error posting score:', error)
	}
}
