import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import NFTCarousel from './NFTCarousel';

// Sample NFTs for the carousel and minting - can be replaced by API/fetch
const sampleNFTs = [
  {
    id: 1,
    name: '3Metad #001',
    description: 'First in the 3Metad NFT series',
    image: 'https://placekitten.com/400/400',
  },
  {
    id: 2,
    name: '3Metad #002',
    description: 'Second in the 3Metad NFT series',
    image: 'https://placekitten.com/401/400',
  },
  {
    id: 3,
    name: '3Metad #003',
    description: 'Third in the 3Metad NFT series',
    image: 'https://placekitten.com/400/401',
  },
];



export default function MintSection() {
  const { account, provider, connectWallet } = useWallet();
  const [contract, setContract] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState(sampleNFTs[0]);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState('');
  const [userNFTCount, setUserNFTCount] = useState(0);
  const [mintPrice, setMintPrice] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [referralCode] = useState(null);
  const [liveMarketPrice, setLiveMarketPrice] = useState(null);
  const [hoveredNFTId, setHoveredNFTId] = useState(null);
  const isMounted = useRef(true);

  // On mount/unmount flag
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Setup contract instance
  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(contractInstance);
    } else {
      setContract(null);
    }
  }, [provider]);

  // Fetch user's NFT balance to verify ownership
  useEffect(() => {
    if (contract && account) {
      contract
        .balanceOf(account)
        .then((balance) => {
          if (isMounted.current) setUserNFTCount(balance.toNumber());
        })
        .catch((err) => {
          console.error('Failed to get NFT balance:', err);
          if (isMounted.current) setUserNFTCount(0);
        });
    } else {
      setUserNFTCount(0);
    }
  }, [contract, account]);

  // Fetch mint price from contract, fallback to mock price after 2s
  useEffect(() => {
    let fallbackTimer;
    if (contract) {
      contract
        .mintPrice()
        .then((price) => {
          if (isMounted.current)
            setMintPrice(ethers.utils.formatEther(price));
        })
        .catch((err) => {
          console.error('Failed to get mint price:', err);
          if (isMounted.current) setMintPrice(null);
        });
    } else {
      setMintPrice(null);
      fallbackTimer = setTimeout(() => {
        if (isMounted.current) setMintPrice('0.01');
      }, 2000);
    }
    return () => clearTimeout(fallbackTimer);
  }, [contract]);

  // Live market price fetch (mock with random value for now)
  useEffect(() => {
    let interval;
    // Simulate live price fluctuations every 5 seconds
    const fetchLivePrice = () => {
      const basePrice = 0.08;
      const variation = (Math.random() - 0.5) * 0.02;
      const price = (basePrice + variation).toFixed(3);
      if (isMounted.current) setLiveMarketPrice(price);
    };
    fetchLivePrice();
    interval = setInterval(fetchLivePrice, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('3metad_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('3metad_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Set share URL once mounted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  // Memoize social share URLs
  const tweetUrl = useMemo(
    () =>
      `https://twitter.com/intent/tweet?text=I just minted an NFT from 3Metad!&url=${encodeURIComponent(
        shareUrl
      )}`,
    [shareUrl]
  );
  const facebookUrl = useMemo(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    [shareUrl]
  );

  // Mint NFT handler
  const handleMint = useCallback(async () => {
    if (!contract || !selectedNFT) {
      setStatus('Please connect your wallet and select an NFT to mint.');
      return;
    }
    if (!mintPrice) {
      setStatus('Mint price is not loaded yet. Please wait.');
      return;
      }

    try {
      setMinting(true);
      setStatus('Waiting for transaction confirmation...');
      const overrides = { value: ethers.utils.parseEther(mintPrice) } ;

      // If referral code is set, you can send it here if your contract supports
      // Example: contract.mintWithReferral(selectedNFT.id, referralCode, overrides)
      // For now, just mint without referral param:
      const tx = await contract.mint(selectedNFT.id, overrides) ;

      setStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setStatus('Mint successful! Your NFT has been minted.') ;

      // Refresh user NFT count after minting
      const balance = await contract.balanceOf(account);
      setUserNFTCount(balance.toNumber());
    } catch (error) {
      console.error('Minting error:', error);
      setStatus(
        error?.data?.message ||
          error?.message ||
          'Minting failed or was cancelled.'
      );
    } finally {
      setMinting(false);
    }
  }, [contract, selectedNFT, mintPrice, account]);

  // Clipboard copy handler
  const handleCopyLink = useCallback(() => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => setStatus('Link copied to clipboard!'))
        .catch(() => setStatus('Failed to copy link.'));
    } else {
      setStatus('Clipboard not supported.');
    }
  }, [shareUrl]);

  // Wishlist toggle
  const toggleWishlist = useCallback(
    (nftId) => {
      setWishlist((prev) => {
        if (prev.includes(nftId)) {
          return prev.filter((id) => id !== nftId);
        } else {
          return [...prev, nftId];
        }
      });
    },
    [setWishlist]
  );

  // Handle NFT hover for zoom effect
  const handleNFTHover = useCallback(
    (nftId) => {
      setHoveredNFTId(nftId);
    },
    [setHoveredNFTId]
  );

  // Handle NFT hover leave
  const handleNFTLeave = useCallback(() => {
    setHoveredNFTId(null);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl text-white font-sans min-h-screen flex flex-col">
      <h1 className="text-4xl font-extrabold mb-6 text-center tracking-tight text-gradient bg-gradient-to-r from-purple-400 to-pink-600">
        3Metad NFT Collection Minting
      </h1>

      <section aria-label="Featured NFTs carousel" className="mb-10">
        <NFTCarousel
          nfts={sampleNFTs}
          onSelect={setSelectedNFT}
          selectedId={selectedNFT?.id}
          onHover={handleNFTHover}
          onLeave={handleNFTLeave}
        />
      </section>

      {/* NFT Details with zoom & hover */}
      <section
        className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10"
        aria-live="polite"
      >
        <div
          className={`relative w-64 h-64 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 ${
            hoveredNFTId === selectedNFT?.id ? 'scale-110' : ''
          }`}
          onMouseEnter={() => handleNFTHover(selectedNFT?.id)}
          onMouseLeave={handleNFTLeave}
          tabIndex={0}
          onFocus={() => handleNFTHover(selectedNFT?.id)}
          onBlur={handleNFTLeave}
          aria-label={`Preview of ${selectedNFT?.name}`}
        >
          <img
            src={selectedNFT?.image}
            alt={selectedNFT?.description}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-bold mb-2">{selectedNFT?.name}</h2>
          <p className="text-gray-300 mb-4">{selectedNFT?.description}</p>

          <p className="text-lg font-semibold">
            Mint Price:{' '}
            <span className="text-pink-500">
              {mintPrice ? `${mintPrice} ETH` : 'Loading...'}
            </span>
          </p>
          <p className="text-sm italic text-gray-500 mb-4">
            Live Market Price: {liveMarketPrice ? `${liveMarketPrice} ETH` : 'Loading...'}
          </p>

          <div className="flex items-center gap-4 mb-6">
            {!account ? (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-400"
                aria-label="Connect Wallet"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <button
                  onClick={handleMint}
                  disabled={minting}
                  className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-colors ${
                    minting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-400'
                  }`}
                  aria-label={`Mint selected NFT ${selectedNFT?.name}`}
                >
                  {minting ? 'Minting...' : 'Mint NFT'}
                </button>

                <button
                  onClick={() => toggleWishlist(selectedNFT.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    wishlist.includes(selectedNFT.id)
                      ? 'border-pink-500 text-pink-500'
                      : 'border-gray-400 text-gray-400'
                  } hover:border-pink-600 hover:text-pink-600 focus:outline-none`}
                  aria-pressed={wishlist.includes(selectedNFT.id)}
                  aria-label={
                    wishlist.includes(selectedNFT.id)
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                >
                  {wishlist.includes(selectedNFT.id) ? '★ Wishlisted' : '☆ Add to Wishlist'}
                </button>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-2">
            You own: <span className="font-semibold">{userNFTCount}</span> 3Metad NFTs
          </p>

          <p
            className="text-sm text-yellow-400 font-mono break-words mb-4"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Copy referral link"
            >
              Copy Referral Link
            </button>

            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Share on Twitter"
            >
              Share on Twitter
            </a>
                      
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Share on Facebook"
            >
              Share on Facebook
            </a>

          </div>

          {referralCode && (
            <p className="mt-3 text-sm text-green-400">
              Referral code detected: <strong>{referralCode}</strong> - You may receive rewards!
            </p>
          )}
        </div>
      </section>

      {/* Wishlist display */}
      <section aria-label="Your Wishlist" className="mb-6">
        <h3 className="text-2xl font-semibold mb-3">Your Wishlist</h3>
        {wishlist.length === 0 ? (
          <p className="text-gray-400 italic">You have no NFTs in your wishlist yet.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wishlist.map((id) => {
              const nft = sampleNFTs.find((n) => n.id === id);
              if (!nft) return null;
              return (
                <li
                  key={id}
                  className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-pink-500 transition-shadow"
                  onClick={() => setSelectedNFT(nft)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedNFT(nft);
                  }}
                  aria-label={`Select NFT ${nft.name} from wishlist`}
                >
                  <img
                    src={nft.image}
                    alt={nft.description}
                    className="object-cover w-full h-40"
                    loading="lazy"
                  />
                  <div className="absolute top-1 right-1 text-pink-500 text-xl select-none">
                    ★
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-auto text-center text-gray-500 text-xs select-none py-4">
        &copy; 2025 3Metad NFT. All rights reserved.
      </footer>
    </div>
  );
}
