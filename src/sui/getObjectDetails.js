import axios from 'axios'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Function to get owned objects
async function getOwnedObjects(address) {
	try {
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'sui_getObject',
			params: [
				address, // Pass the owner address directly as a string
				{
					showType: true,
					showOwner: true,
					showPreviousTransaction: true,
					showDisplay: false,
					showContent: true,
					showBcs: false,
					showStorageRebate: true,
				},
			],
		})

		// Extract the content object
		const content = response.data.result.data.content.fields

		// Log the content object
		console.log('Content:', content)
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
	'0xc12380464a0a8ed2332766174621e07babccb0e532b151bd292d2b82274aa3d4'

// Call the function
getOwnedObjects(address)
