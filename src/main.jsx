import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/input.scss'
import '@mysten/dapp-kit/dist/index.css'

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const networks = {
	devnet: { url: getFullnodeUrl('devnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
}

const rootElement = document.getElementById('root')

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<SuiClientProvider networks={networks} defaultNetwork="testnet">
					<WalletProvider>
						<App />
					</WalletProvider>
				</SuiClientProvider>
			</QueryClientProvider>
		</React.StrictMode>,
	)
} else {
	console.error('Could not find root element')
}
