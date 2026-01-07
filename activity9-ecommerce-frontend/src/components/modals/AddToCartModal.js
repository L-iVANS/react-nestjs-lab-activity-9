import React from "react";

const AddToCartModal = ({ open, onClose, onConfirm, maxQty, productName }) => {
  const [qty, setQty] = React.useState(1);
  React.useEffect(() => { if (open) setQty(1); }, [open]);

  if (!open) return null;

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
        className="bg-white/90 shadow-xl p-8 w-80 relative transition-all duration-300" style={{ borderRadius: '0 0 1rem 0' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-indigo-400 text-2xl rounded-full bg-indigo-50 p-1 shadow-md transition-all duration-200"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2">{productName}</h2>
        <div className="mb-4 text-sm text-gray-500">Available: <span className="font-semibold">{maxQty}</span></div>
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="qty" className="text-sm font-semibold">Quantity:</label>
          <input
            id="qty"
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            onChange={e => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value))))}
            className="border-2 border-indigo-200 rounded-full px-3 py-1 w-16 text-center shadow-inner focus:border-indigo-400 transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 shadow transition-all duration-200"
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 shadow transition-all duration-200"
            onClick={e => {
              e.stopPropagation();
              onConfirm(qty);
            }}
            disabled={qty < 1 || qty > maxQty}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
