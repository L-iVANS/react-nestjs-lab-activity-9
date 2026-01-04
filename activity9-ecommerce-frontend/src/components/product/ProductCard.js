
import React from "react";

const ProductCard = ({ name, price, isGuest }) => (
  <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-end shadow-sm w-full h-full min-h-0">
    <div className="mb-12"></div>
    <div className="mb-2 text-base font-semibold">{name}</div>
    <div className="mb-2 text-sm">{price}</div>
    <div className="flex items-center gap-2">
      <button
        className={`text-white font-bold py-2 px-6 rounded transition ${isGuest ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110'}`}
        style={{ backgroundColor: 'var(--accent-color)' }}
        disabled={isGuest}
        onClick={isGuest ? undefined : () => alert('Buy Now clicked!')}
      >
        Buy Now
      </button>
      <span
        className={`bg-gray-300 rounded p-2 ${isGuest ? 'opacity-80 cursor-not-allowed' : 'hover:bg-gray-400 transition cursor-pointer'}`}
        onClick={isGuest ? undefined : () => alert('Add to cart clicked!')}
        role="button"
        tabIndex={isGuest ? -1 : 0}
        aria-disabled={isGuest}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 14.25a2.25 2.25 0 002.25 1.75h6.75a2.25 2.25 0 002.25-1.75l1.394-7.978a.563.563 0 00-.553-.647H6.272m-1.166 0L4.06 4.272A1.125 1.125 0 015.125 3.75h1.5m0 0h11.25" />
        </svg>
      </span>
    </div>
  </div>
);

export default ProductCard;
