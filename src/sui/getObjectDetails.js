import axios from 'axios'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Collection identifiers for filtering
const collectionIdentifiers = [
	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstGun',
]

// Array to store objects that pass the filter
const filteredObjects = []

// Function to get owned objects and fetch their types separately
async function getOwnedObjectsWithType(address) {
	try {
		// Fetch owned objects including type
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'suix_getOwnedObjects',
			params: [
				address, // Owner address
				{
					showType: true,
					showOwner: true,
					showDisplay: true,
				},
			],
		})

		// Log the entire response to inspect the structure
		console.log('Full Response:', JSON.stringify(response.data, null, 2))

		// Check if result contains data
		if (response.data?.result?.data) {
			const ownedObjects = response.data.result.data

			// Iterate over the owned objects
			for (const obj of ownedObjects) {
				const objectId = obj?.data?.objectId

				// Fetch detailed object info to retrieve the type
				await fetchObjectDetails(objectId)
			}

			// Return or log the filtered objects
			console.log('Filtered Objects:', filteredObjects)
		} else {
			console.error('No owned objects found for this address.')
		}
	} catch (error) {
		console.error('Error fetching owned objects:', error.message)
		if (error.response) {
			console.error('Response error:', error.response.data)
		}
	}
}

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

		// Check if the object type matches the collection identifiers
		if (objectType && collectionIdentifiers.includes(objectType)) {
			// Add matching objects to the filteredObjects array
			filteredObjects.push({
				objectId,
				objectType,
				content,
			})
		} else {
			console.log(
				`Object ID: ${objectId} does not belong to the target collection.`,
			)
		}
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

// Replace with the SUI address you want to query
const address =
	'0xf3818b7fc2702b188659042fa845efab12ed8a9e37bbad7b506d70cb4728e512'

// Call the function to fetch owned objects and their types
getOwnedObjectsWithType(address)
