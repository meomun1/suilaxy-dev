import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui.js/faucet'
import { MIST_PER_SUI } from '@mysten/sui.js/utils'

const MY_ADDRESS =
	'0x12c4cfc14d6b1ead73b07ba64aefa0f1750d3d4988dcd783685d7626e9961525'

const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') })

// Convert MIST to Sui
const balance = (balance) => {
	return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI)
}

// store the JSON representation for the SUI the address owns before using faucet
const suiBefore = await suiClient.getBalance({
	owner: MY_ADDRESS,
})

await requestSuiFromFaucetV1({
	host: getFaucetHost('devnet'),
	recipient: MY_ADDRESS,
})

// Function to wait for a specific time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Retry logic to check balance until it reflects the new amount
const getUpdatedBalance = async (retries = 10, delayMs = 3000) => {
	for (let i = 0; i < retries; i++) {
		const suiAfter = await suiClient.getBalance({
			owner: MY_ADDRESS,
		})
		if (balance(suiAfter) > balance(suiBefore)) {
			return suiAfter
		}
		await delay(delayMs)
	}
	throw new Error('Balance did not update in the expected time frame')
}

try {
	const suiAfter = await getUpdatedBalance()

	// Output result to console.
	console.log('SUI Before:', balance(suiBefore))
	console.log('SUI After:', balance(suiAfter))
} catch (error) {
	console.error('Failed to update balance:', error)
}
