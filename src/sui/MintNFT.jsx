import React, { useState } from 'react';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import {
    ConnectButton,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';

// Testnet package: 0x10484340eef2b5fcf5de4237ff0264890a93d648aa927468faf650e09a0738fa

// Initialize Sui client
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

const MintNFT = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [digest, setDigest] = useState('');
    const [error, setError] = useState(null);

    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const handleMint = async () => {
        try {
            if (!currentAccount) {
                throw new Error('No account connected');
            }

            if (!name || !description || !url) {
                throw new Error('All fields are required');
            }

            console.log('Name:', name);
            console.log('Description:', description);
            console.log('URL:', url);

            // Create a new transaction block
            const txb = new TransactionBlock();
            const sender = currentAccount.address;
            txb.setSender(sender);
            console.log('Sender:', sender); // Print out the sender address
            txb.moveCall({
                target:
                    '0x10484340eef2b5fcf5de4237ff0264890a93d648aa927468faf650e09a0738fa::suilaxy_nft::mint_to_sender',
                arguments: [txb.pure(name), txb.pure(description), txb.pure(url)],
            });

            // Sign and execute the transaction block using the current account's keypair
            signAndExecuteTransactionBlock(
                {
                    transactionBlock: txb,
                    chain: 'sui:testnet',
                },
                {
                    onSuccess: (result) => {
                        console.log('Executed transaction block', result);
                        setDigest(result.digest);
                    },
                    onError: (err) => {
                        setError(err.message);
                        console.error('Failed to mint NFT:', err);
                    },
                }
            );
        } catch (err) {
            setError(err.message);
            console.error('Failed to mint NFT:', err);
            console.error('Complete Error:', err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <ConnectButton />
            {currentAccount && (
                <>
                    <h2>Mint Your NFT</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button onClick={handleMint}>Mint NFT</button>
                    {digest && (
                        <p>NFT minted successfully! Transaction: {digest}</p>
                    )}
                    {error && <p>Error: {error}</p>}
                </>
            )}
        </div>
    );
};

export default MintNFT;
