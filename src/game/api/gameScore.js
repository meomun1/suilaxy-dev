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
		console.log('Score posted successfully')
	} catch (error) {
		console.error('Error posting score:', error)
	}
}
