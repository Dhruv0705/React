import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

const SUPPORTED_CHAIN_ID = 80001; // Polygon Mumbai

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [error, setError] = useState(null);

  const ethereum = typeof window !== 'undefined' ? window.ethereum : null;

  const parseChainId = (id) => {
    if (!id) return null;
    return typeof id === 'string' && id.startsWith('0x')
      ? parseInt(id, 16)
      : Number(id);
  };

  const switchToPolygon = useCallback(async () => {
    if (!ethereum) return false;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Mumbai hex
      });
      return true;
    } catch (err) {
      if (err.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
          return true;
        } catch (addError) {
          setError('Failed to add Polygon Mumbai network to MetaMask.');
          console.error(addError);
          return false;
        }
      } else {
        setError('Failed to switch network. Please switch manually.');
        console.error(err);
        return false;
      }
    }
  }, [ethereum]);

  const connectWallet = useCallback(async () => {
    if (!ethereum) {
      setError('MetaMask not detected. Please install it to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ethProvider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await ethProvider.send('eth_requestAccounts', []);
      const network = await ethProvider.getNetwork();

      setProvider(ethProvider);
      setSigner(ethProvider.getSigner());
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setIsCorrectNetwork(network.chainId === SUPPORTED_CHAIN_ID);

      if (network.chainId !== SUPPORTED_CHAIN_ID) {
        // Optionally prompt user to switch network
        const switched = await switchToPolygon();
        if (!switched) {
          setIsCorrectNetwork(false);
        }
      }
    } catch (err) {
      setError('Connection rejected or failed.');
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, [ethereum, switchToPolygon]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsCorrectNetwork(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!ethereum) return;

    const ethProvider = new ethers.providers.Web3Provider(ethereum);
    setProvider(ethProvider);
    setSigner(ethProvider.getSigner());

    const fetchData = async () => {
      try {
        const accounts = await ethProvider.send('eth_accounts', []);
        const network = await ethProvider.getNetwork();

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setChainId(network.chainId);
          setIsCorrectNetwork(network.chainId === SUPPORTED_CHAIN_ID);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    fetchData();

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : null);
    };

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseChainId(chainIdHex);
      setChainId(newChainId);
      setIsCorrectNetwork(newChainId === SUPPORTED_CHAIN_ID);
      // reload is heavy; better to update state and handle UI accordingly
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [ethereum]);

  const verifyNFTOwnership = useCallback(
    async (contractAddress, abi) => {
      if (!provider || !account) return false;

      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.balanceOf(account);
        return balance.gt(0);
      } catch (err) {
        console.error('NFT ownership verification failed:', err);
        return false;
      }
    },
    [provider, account]
  );

  const contextValue = useMemo(
    () => ({
      account,
      provider,
      signer,
      connectWallet,
      disconnectWallet,
      chainId,
      isConnecting,
      isCorrectNetwork,
      verifyNFTOwnership,
      error,
    }),
    [
      account,
      provider,
      signer,
      connectWallet,
      disconnectWallet,
      chainId,
      isConnecting,
      isCorrectNetwork,
      verifyNFTOwnership,
      error,
    ]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}