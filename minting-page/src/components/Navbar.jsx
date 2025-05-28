import React, { useState, useCallback } from 'react';
import { useWallet } from '../../../src/hooks/useWallet';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';

export default function Navbar() {
  const { account, connectWallet, disconnectWallet, isConnecting, error } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [account]);

  const openCollection = () => {
    window.open('https://3metad.com/nft-collection', '_blank');
  };

  return (
    <nav
      className="bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full shadow-lg rounded-b-md"
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Logo/Brand */}
      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
        <img src="/logo.svg" alt="3Metad Logo" className="h-8 w-8" />
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 select-none">
          3Metad NFT Mint
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* View Collection */}
        <button
          onClick={openCollection}
          className="hidden sm:inline-flex items-center bg-indigo-600 px-3 py-2 rounded hover:bg-indigo-700 transition text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          title="View NFT Collection"
        >
          Collection <FaExternalLinkAlt className="ml-2" />
        </button>

        {/* Wallet Connected */}
        {!account ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Connect Wallet"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <>
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="flex items-center bg-gray-700 px-3 py-2 rounded hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                aria-label="Copy Wallet Address"
                title={copied ? 'Copied!' : 'Click to copy address'}
              >
                {account.slice(0, 6)}...{account.slice(-4)}
                {copied ? (
                  <FaCheck className="ml-2 text-green-400" />
                ) : (
                  <FaCopy className="ml-2 text-gray-400" />
                )}
              </button>
              <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow-md transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {copied ? 'Address Copied' : 'Copy to clipboard'}
              </span>
            </div>

            <button
              onClick={disconnectWallet}
              className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              aria-label="Disconnect Wallet"
            >
              Disconnect
            </button>

            {/* Optional Share Feature */}
            <button
              onClick={() =>
                navigator.share?.({
                  title: '3Metad NFT Mint',
                  text: 'Check out the 3Metad NFT collection!',
                  url: window.location.href,
                }) ?? alert('Share not supported on this browser')
              }
              className="hidden sm:flex items-center bg-gray-700 px-3 py-2 rounded hover:bg-gray-600 transition text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              title="Share this page"
            >
              <FiShare2 className="mr-1" /> Share
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-2 sm:mt-0 text-center sm:text-left" role="alert">
          {error.message || 'Failed to connect wallet'}
        </p>
      )}
    </nav>
  );
}
