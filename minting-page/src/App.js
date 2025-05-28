import React from 'react';
import { WalletProvider } from './hooks/useWallet';
import MintSection from './components/MintSection'; // Adjust path as needed

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
        <header className="w-full max-w-4xl">
          <h1 className="text-center text-4xl font-extrabold mb-8 select-none">
            3Metad NFT Minting dApp
          </h1>
        </header>

        <main className="w-full max-w-4xl flex-grow">
          <MintSection />
        </main>

        <footer className="w-full max-w-4xl mt-12 text-center text-gray-400 text-sm select-none">
          &copy; {new Date().getFullYear()} 3Metad NFT Collection. All rights reserved.
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;