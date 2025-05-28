import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import NFTCard from './NFTCard'; // Your NFTCard component with image zoom & hover effect
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// Dummy NFT collection metadata (replace with real data or fetch dynamically)
const sampleNFTs = [
  {
    id: 1,
    name: '3Metad #001',
    description: 'First in the 3Metad NFT series',
    image: 'https://via.placeholder.com/400x400.png?text=3Metad+001',
    extraInfo: 'Rare edition with unique traits.',
    priceEth: '0.05', // example price in ETH
  },
  {
    id: 2,
    name: '3Metad #002',
    description: 'Second in the collection',
    image: 'https://via.placeholder.com/400x400.png?text=3Metad+002',
    extraInfo: 'Special animated edition.',
    priceEth: '0.06',
  },
  {
    id: 3,
    name: '3Metad #003',
    description: 'Third collectible',
    image: 'https://via.placeholder.com/400x400.png?text=3Metad+003',
    extraInfo: 'Limited time release.',
    priceEth: '0.07',
  },
];

// Sample smart contract ABI (replace with your own contract's ABI)
const contractABI = [
  "function mint(uint256 tokenId) public payable",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function getMintPrice(uint256 tokenId) public view returns (uint256)"
];

// Sample contract address (Polygon testnet)
const contractAddress = '0xYourContractAddressHere';

export default function NFTMintingPage() {
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  // Wallet & blockchain state
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState(new Set());
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Memoize total NFTs for performance
  const totalNFTs = useMemo(() => sampleNFTs.length, []);

  // Connect wallet using ethers.js
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask!');
      return;
    }
    try {
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setProvider(provider);
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  // Fetch owned NFTs by wallet address
  const fetchOwnedNFTs = useCallback(async () => {
    if (!contract || !walletAddress) return;
    try {
      const owned = new Set();
      for (const nft of sampleNFTs) {
        try {
          const owner = await contract.ownerOf(nft.id);
          if (owner.toLowerCase() === walletAddress.toLowerCase()) {
            owned.add(nft.id);
          }
        } catch {
          // ownerOf may throw if token not minted yet - ignore
        }
      }
      setOwnedNFTs(owned);
    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
    }
  }, [contract, walletAddress]);

  useEffect(() => {
    fetchOwnedNFTs();
  }, [fetchOwnedNFTs]);

  // Mint selected NFT
  const mintNFT = async (nft) => {
    if (!contract || !walletAddress) {
      alert('Please connect your wallet first!');
      return;
    }
    setIsMinting(true);
    try {
      // Get mint price from contract or fallback to metadata price
      let price = ethers.utils.parseEther(nft.priceEth);
      if (contract.getMintPrice) {
        price = await contract.getMintPrice(nft.id);
      }
      const tx = await contract.mint(nft.id, { value: price });
      await tx.wait();
      alert(`Minted ${nft.name}!`);
      fetchOwnedNFTs();
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. See console for details.');
    }
    setIsMinting(false);
  };

  // Carousel navigation handlers
  const next = useCallback(() => setCurrentIndex((i) => (i + 1) % totalNFTs), [totalNFTs]);
  const prev = useCallback(() => setCurrentIndex((i) => (i - 1 + totalNFTs) % totalNFTs), [totalNFTs]);

  // Swipe support
  useEffect(() => {
    let touchStartX = 0;
    function handleTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX;
    }
    function handleTouchEnd(e) {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) next();
      if (touchEndX > touchStartX + 50) prev();
    }
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [next, prev]);

  // Wishlist toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      localStorage.setItem('wishlist', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const currentNFT = sampleNFTs[currentIndex];
  const isOwned = ownedNFTs.has(currentNFT.id);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10 bg-white rounded-lg shadow-md">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">3Metad NFT Minting</h1>
        {walletAddress ? (
          <span
            title={walletAddress}
            className="text-sm text-green-600 font-mono truncate max-w-xs mt-2 sm:mt-0"
          >
            Connected: {walletAddress}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <section className="relative">
        <NFTCard
          nft={currentNFT}
          isOwned={isOwned}
          isWishlisted={wishlist.has(currentNFT.id)}
          onWishlistToggle={() => toggleWishlist(currentNFT.id)}
          zoomOnHover
          className="mx-auto"
        />

        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <button
            onClick={prev}
            aria-label="Previous NFT"
            className="bg-indigo-600 text-white p-3 rounded-full shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
          >
            &#8592;
          </button>
        </div>

        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <button
            onClick={next}
            aria-label="Next NFT"
            className="bg-indigo-600 text-white p-3 rounded-full shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
          >
            &#8594;
          </button>
        </div>
      </section>

      <div className="flex justify-center space-x-3 mt-6">
        {sampleNFTs.map((nft, i) => (
          <button
            key={nft.id}
            onClick={() => setCurrentIndex(i)}
            aria-label={`View ${nft.name}`}
            className={`w-3 h-3 rounded-full transition ${
              i === currentIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            type="button"
          />
        ))}
      </div>

      <section className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">{currentNFT.name}</p>
            <p className="text-gray-600">{currentNFT.description}</p>
            <p className="mt-1 text-sm text-indigo-700 font-semibold">
              Price: {currentNFT.priceEth} ETH (~${(parseFloat(currentNFT.priceEth) * 1200).toFixed(2)})
            </p>
            {isOwned && (
              <p className="mt-2 text-green-700 font-semibold">You own this NFT!</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => mintNFT(currentNFT)}
              disabled={isMinting || isOwned || !walletAddress}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
                isMinting || isOwned || !walletAddress
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              type="button"
              aria-live="polite"
              aria-busy={isMinting}
            >
              {isMinting ? 'Minting...' : isOwned ? 'Already Owned' : 'Mint Now'}
            </button>

            <button
              onClick={() => toggleWishlist(currentNFT.id)}
              aria-label={wishlist.has(currentNFT.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              className="text-indigo-600 hover:text-indigo-800 text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="button"
            >
              {wishlist.has(currentNFT.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </section>

      {/* Optional Social Sharing */}
      <section className="mt-10 text-center">
        <p className="text-sm text-gray-500">
          Share your mint on{' '}
          <a
            href={`https://twitter.com/intent/tweet?text=I%20just%20minted%20${encodeURIComponent(
              currentNFT.name,
            )}%20on%203Metad!%20Check%20it%20out%20at%20https://3metad.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Twitter
          </a>
          .
        </p>
      </section>
    </div>
  );
}
