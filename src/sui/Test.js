import axios from 'axios'

async function fetchSuiOwnedObjects() {
	// Define the JSON-RPC request payload
	const data = {
		jsonrpc: '2.0',
		id: 1,
		method: 'suix_getOwnedObjects',
		params: [
			'0xadf0e8cd05218c676c0cb7864b707f02a9078fe2c2364d4b17a7eeec0ab4c4c9',
			{
				filter: {
					MatchAll: [
						{
							StructType: '0x2::coin::Coin<0x2::sui::SUI>',
						},
						{
							AddressOwner:
								'0xadf0e8cd05218c676c0cb7864b707f02a9078fe2c2364d4b17a7eeec0ab4c4c9',
						},
						{
							Version: '13488',
						},
					],
				},
				options: {
					showType: true,
					showOwner: true,
					showPreviousTransaction: true,
					showDisplay: false,
					showContent: false,
					showBcs: false,
					showStorageRebate: false,
				},
			},
			'0x8a417a09c971859f8f2b8ec279438a25d8876ea3c60e345ac3861444136b4a1b',
			3,
		],
	}

	try {
		// Send the JSON-RPC request using axios
		const response = await axios.post('https://fullnode.testnet.sui.io', data)

		// Handle and display the response
		console.log('Response Data:', response.data)
	} catch (error) {
		console.error('Error fetching data:', error)
	}
}

// Call the function to fetch the data
fetchSuiOwnedObjects()
