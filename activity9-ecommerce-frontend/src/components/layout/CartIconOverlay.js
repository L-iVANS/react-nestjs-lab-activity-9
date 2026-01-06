
import React from "react";
import cartIcon from "../../assets/icons/Cart.png";

const CartIconOverlay = ({ onClick, count, small }) => (
  <button
    className={`shadow-lg rounded-full transition border border-gray-200 flex items-center ${small ? 'p-1' : 'p-3'}`}
    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)", backgroundColor: 'var(--accent-color)' }}
    onClick={onClick}
    aria-label="Cart"
  >
    <img src={cartIcon} alt="Cart" className={small ? "w-5 h-5" : "w-8 h-8"} />
    {count > 0 && (
      <span className={`ml-2 bg-white text-[#7c3aed] text-xs font-bold px-2 py-1 rounded-full border border-[#7c3aed] ${small ? 'px-1 py-0.5 text-[10px]' : ''}`}>
        {count}
      </span>
    )}
  </button>
);

export default CartIconOverlay;
