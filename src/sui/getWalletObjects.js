import axios from 'axios'

// Sui full node endpoint
const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443'

// Collection identifiers to filter the objects (specific to your collection)
const collectionIdentifiers = [
	'0xd1fdf1270ca89b28a68d02e1b0bf20b8438d72c51ca207ab3d1790ba528d6513::suilaxy_nft::TheFirstGun',
]

// Array to hold the names of NFTs from your collection
const objectNames = []

// Function to get object details by object ID and extract the name
async function getObjectDetails(objectId) {
	try {
		const response = await axios.post(SUI_RPC_URL, {
			jsonrpc: '2.0',
			id: 1,
			method: 'sui_getObject',
			params: [
				objectId, // Use the object ID
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

		// Log the full response details for each object
		console.log(`Full Object Details for ${objectId}:`, response.data)

		// Extract the content object (which includes name, description, etc.)
		const content = response.data?.result?.data?.content?.fields

		// Add the name to the array if it exists
		if (content && content.name) {
			objectNames.push(content.name)
			console.log(`Name of object ${objectId}:`, content.name)
		} else {
			console.error(
				`Name field for object ${objectId} is undefined or not present.`,
			)
		}
	} catch (error) {
		console.error(
			`Error fetching details for object ${objectId}:`,
			error.message,
		)
		if (error.response) {
			// The server responded with a status code outside the 2xx range
			console.error('Response error:', error.response.data)
		}
	}
}

// Function to get owned objects and then get details for each object
async function getOwnedObjectsAndDetails(address) {
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
					showDisplay: true,
				},
			],
		})

		// Log the entire response to understand its structure
		console.log('Full Response:', response.data)

		// Check if result is present and contains data
		if (response.data?.result?.data) {
			const ownedObjects = response.data.result.data

			// Iterate over each object and fetch its details if it matches the filter
			for (const obj of ownedObjects) {
				// Log the full object details for debugging
				console.log('Full Object Data:', obj)

				const objectId = obj?.data?.objectId
				const objectType = obj?.data?.type // Extract type from object

				// Log the object ID and type for confirmation
				console.log(`Object ID: ${objectId}, Object Type: ${objectType}`)

				// Filter the object based on the collection identifiers
				if (
					objectType &&
					collectionIdentifiers.some((id) => objectType.includes(id))
				) {
					console.log(`Fetching object details for ID: ${objectId}`)
					await getObjectDetails(objectId)
				} else {
					console.log(`Skipping object ${objectId} - not in the collection.`)
				}
			}

			// Log the final array of names
			console.log('Array of Names:', objectNames)
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
	'0xf3818b7fc2702b188659042fa845efab12ed8a9e37bbad7b506d70cb4728e512'

// Call the function to get owned objects and their details
getOwnedObjectsAndDetails(address)
