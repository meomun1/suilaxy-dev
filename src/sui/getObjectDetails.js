import axios from 'axios'
import { fetchObjectAttributes } from './getAttributes.js'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Function to fetch object details including its type
async function fetchObjectDetails(objectId) {
	try {
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'sui_getObject',
			params: [
				objectId,
				{
					showType: true, // Ensure the type is requested
					showOwner: true,
					showPreviousTransaction: true,
					showDisplay: true,
					showContent: true,
					showBcs: false,
					showStorageRebate: true,
				},
			],
		})

		const objectType = response.data?.result?.data?.type
		const content = response.data?.result?.data?.content?.fields

		console.log('Object Details:', {
			objectId,
			objectType,
			content,
		})

		// Fetch and print attributes
		await fetchObjectAttributes(objectId)
	} catch (error) {
		console.error(
			`Error fetching details for object ${objectId}:`,
			error.message,
		)
		if (error.response) {
			console.error('Response error:', error.response.data)
		}
	}
}

// Replace with the object ID you want to query
const objectId =
	'0x5707bf42e3a3f8ed5a838b12998ec9e2ede2dee1fbf95b0cae5fad8e04eec8b9'

// Call the function to fetch object details
fetchObjectDetails(objectId)
