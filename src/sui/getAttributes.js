import axios from 'axios'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.devnet.sui.io:443'

// Function to fetch object attributes
export async function fetchObjectAttributes(objectId) {
	try {
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'sui_getObject',
			params: [
				objectId,
				{
					showContent: true, // Ensure the content is requested
				},
			],
		})

		const attributes = response.data?.result?.data?.content?.fields?.attributes

		console.log(`Attributes for Object ID ${objectId}:`, attributes)
	} catch (error) {
		console.error(
			`Error fetching attributes for object ${objectId}:`,
			error.message,
		)
		if (error.response) {
			console.error('Response error:', error.response.data)
		}
	}
}
