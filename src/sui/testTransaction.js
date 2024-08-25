import { Transaction } from '@mysten/sui/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl('testnet')

// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl })
// Keypair from an existing secret key (Uint8Array)
const keypair = Ed25519Keypair.fromSecretKey(secretKey)

// get coins owned by an address
// replace <OWNER_ADDRESS> with actual address in the form of 0x123...
client
	.getCoins({
		owner: '0xf3818b7fc2702b188659042fa845efab12ed8a9e37bbad7b506d70cb4728e512',
	})
	.then(async () => {
		const tx = new Transaction()

		const [coin] = tx.splitCoins(tx.gas, [1])

		// transfer the split coin to a specific address
		tx.transferObjects(
			[coin],
			'0xa84a74d18762c8981749f539849f72888ffe554069d6b37451aff73d6c20c171',
		)

		const result = await client.signAndExecuteTransaction({
			transaction: tx,
			signer: keypair,
			requestType: 'WaitForLocalExecution',
			options: {
				showEffects: true,
			},
		})

		console.log(result)
	})
	.catch(console.error)
