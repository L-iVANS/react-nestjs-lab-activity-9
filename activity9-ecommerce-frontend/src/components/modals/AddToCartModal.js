import React from "react";
import { useTheme } from "../../context/ThemeContext";

const AddToCartModal = ({ open, onClose, onConfirm, maxQty, productName }) => {
  const [qty, setQty] = React.useState(1);
  const { isDarkMode } = useTheme();
  React.useEffect(() => { if (open) setQty(1); }, [open]);

  // Don't show modal if no stock available
  if (!open || !maxQty || maxQty <= 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={e => {
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div 
        className={`shadow-xl p-8 w-80 relative transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white/90'
        }`} style={{ borderRadius: '0 0 1rem 0' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`absolute top-2 right-2 text-2xl rounded-full p-1 shadow-md transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:text-indigo-400 bg-gray-700' 
              : 'text-gray-400 hover:text-indigo-400 bg-indigo-50'
          }`}
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{productName}</h2>
        <div className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available: <span className="font-semibold">{maxQty}</span></div>
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="qty" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quantity:</label>
          <input
            id="qty"
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            onChange={e => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value))))}
            className={`border-2 rounded-full px-3 py-1 w-16 text-center shadow-inner transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500' 
                : 'border-indigo-200 bg-white focus:border-indigo-400'
            }`}
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={e => {
              e.stopPropagation();
              onConfirm(qty);
            }}
            disabled={qty < 1 || qty > maxQty || maxQty <= 0}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
