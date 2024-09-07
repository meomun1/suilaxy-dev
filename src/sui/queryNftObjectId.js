import axios from 'axios'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Function to get owned objects
async function getOwnedObjects(address) {
	try {
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'suix_getOwnedObjects',
			params: [
				address, // Pass the owner address directly as a string
				{
					showType: true,
					showOwner: true,
					showPreviousTransaction: true,
					showStorageRebate: true,
					showDisplay: true,
				},
			],
		})

		// Log the entire response object
		console.log('Full Response:', response.data)

		// Check if result is present and log the data
		if (response.data.result && response.data.result.data) {
			console.log('Owned Objects:', response.data.result.data)
		} else {
			console.error('No data found in the response:', response.data)
		}
	} catch (error) {
		console.error('Error fetching owned objects:', error.message)
		if (error.response) {
			// The server responded with a status code outside the 2xx range
			console.error('Response error:', error.response.data)
		}
	}
}

// Replace with the SUI address you want to query
const address =
	'0xc6e0b6f91f9f0b8fa9a9c67addefbd9e5bbae269ad5c8e20b501660a09669920'

// Call the function
getOwnedObjects(address)
