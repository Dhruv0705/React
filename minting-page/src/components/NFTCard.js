import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const NFTCard = React.memo(function NFTCard({
  nft,
  onWishlistToggle = () => {},
  isWishlisted = false,
  onClick = () => {},
}) {
  const [zoomed, setZoomed] = useState(false);
  const [toggleDisabled, setToggleDisabled] = useState(false);

  // Prevent rapid toggling spam
  const handleWishlistToggle = useCallback(
    (e) => {
      e.stopPropagation();
      if (toggleDisabled) return;
      setToggleDisabled(true);
      onWishlistToggle(nft.id);
      setTimeout(() => setToggleDisabled(false), 300);
    },
    [nft.id, onWishlistToggle, toggleDisabled]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow outline-none focus:ring-4 focus:ring-blue-500"
      aria-label={`${nft.name} NFT card`}
    >
      <img
        src={nft.image}
        alt={nft.name}
        loading="lazy"
        className={`w-full h-auto max-h-64 object-cover transform transition-transform duration-300 ease-in-out origin-center ${
          zoomed ? 'scale-110' : 'scale-100'
        }`}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{nft.name}</h3>
        <p className="text-gray-400 text-sm">{nft.description}</p>
      </div>

      <button
        onClick={handleWishlistToggle}
        disabled={toggleDisabled}
        className="absolute top-2 right-2 text-red-500 text-xl focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        aria-pressed={isWishlisted}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        type="button"
      >
        {isWishlisted ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
      </button>

      {/* Hover overlay info */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 text-center pointer-events-none select-none transition-opacity duration-300 ${
          zoomed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="mb-2 text-sm italic">
          {nft.extraInfo || 'Unique digital collectible'}
        </p>
        <p className="text-xs opacity-80">Tap to mint from the main section.</p>
      </div>
    </div>
  );
});

NFTCard.propTypes = {
  nft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string.isRequired,
    extraInfo: PropTypes.string,
  }).isRequired,
  onWishlistToggle: PropTypes.func,
  isWishlisted: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NFTCard;