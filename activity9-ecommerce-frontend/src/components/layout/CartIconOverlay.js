
import React from "react";
import cartIcon from "../../assets/icons/Cart.png";

const CartIconOverlay = ({ onClick, count, small }) => (
  <button
    className={`shadow-xl rounded-full transition-all duration-200 border-2 border-indigo-200 flex items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 hover:scale-110 hover:shadow-2xl ${small ? 'p-1' : 'p-3'}`}
    style={{ boxShadow: "0 4px 16px 0 #6366f1aa", backgroundColor: 'transparent' }}
    onClick={onClick}
    aria-label="Cart"
  >
    <span style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #6366f1 70%, #a5b4fc 100%)',
      padding: small ? '3px' : '7px',
      boxShadow: '0 2px 8px 0 #6366f1aa',
    }}>
      <img
        src={cartIcon}
        alt="Cart"
        className={small ? "w-5 h-5" : "w-8 h-8"}
        style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 2px #fff) drop-shadow(0 0 6px #6366f1)' }}
      />
    </span>
    {count > 0 && (
      <span className={`ml-2 bg-white text-[#7c3aed] text-xs font-bold px-2 py-1 rounded-full border border-[#7c3aed] ${small ? 'px-1 py-0.5 text-[10px]' : ''}`}>
        {count}
      </span>
    )}
  </button>
);

export default CartIconOverlay;
