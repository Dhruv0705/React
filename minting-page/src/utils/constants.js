export const CONTRACT_ADDRESS = '0xYourPolygonTestnetContractAddressHere';

// Minimal ABI for interacting with the NFT contract
// Includes mint (payable), balanceOf, mintPrice (view), and tokenURI (view)
export const CONTRACT_ABI = [
  "function mint(uint256 quantity) payable",
  "function balanceOf(address owner) view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Polygon Mumbai testnet chain ID (in hexadecimal string format)
export const POLYGON_MUMBAI_CHAIN_ID = '0x13881';

// Helper to convert hex chainId to decimal number (optional utility for consistency)
export function parseChainId(chainIdHex) {
  try {
    return Number(chainIdHex);
  } catch {
    return null;
  }
}