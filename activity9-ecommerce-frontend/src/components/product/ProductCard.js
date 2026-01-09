import React from "react";
import Toast from "../common/Toast";
import AddToCartModal from "../modals/AddToCartModal";
import addToCartIcon from "../../assets/icons/qlementine-icons_add-to-cart-16.png";

const ProductCard = ({ productId, productName, productPrice, quantity, images, isAdmin, isGuest, onRemove, onAddToCart, onUpdate }) => {
    const [toast, setToast] = React.useState(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [currentImg, setCurrentImg] = React.useState(0);
  const [editing, setEditing] = React.useState(false);
  const [tempQty, setTempQty] = React.useState(quantity);
  const [tempName, setTempName] = React.useState(productName);
  const [tempPrice, setTempPrice] = React.useState(productPrice);

  // Debug logging for images
  React.useEffect(() => {
    console.log('ProductCard received images:', images);
    console.log('Images type:', typeof images, 'Is array:', Array.isArray(images));
    if (images && images.length > 0) {
      console.log('First image preview:', images[0]?.substring(0, 100));
    }
  }, [images]);

  const validImages = images && Array.isArray(images) ? images.filter(img => img) : [];

  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove();
    } else {
      setToast({ message: "Remove item clicked! (No handler provided)", type: "info" });
    }
  };

  const handleEdit = () => {
    setTempQty(quantity);
    setTempName(productName);
    setTempPrice(productPrice);
    setEditing(true);
  };

  const handleQtyInput = (e) => {
    const val = Math.max(0, Number(e.target.value));
    setTempQty(val);
  };

  const handleConfirm = () => {
    if (typeof onUpdate === 'function') {
      onUpdate({
        name: tempName,
        price: tempPrice,
        stock: tempQty
      });
    }
    setEditing(false);
    setToast({ message: "Product updated!", type: "success" });
  };

  const handleCancel = () => {
    setTempQty(quantity);
    setTempName(productName);
    setTempPrice(productPrice);
    setEditing(false);
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div
      className="rounded-xl flex flex-col items-center justify-between w-full h-full min-h-0 relative transition-transform duration-200 group"
      style={{
        width: '260px',
        background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
        border: '1.5px solid #e0e7ff',
        padding: '1.5rem 1.25rem 1.25rem 1.25rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(99,102,241,0.18)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(99,102,241,0.10)'}
    >
      {/* Product Images */}
      {validImages && validImages.length > 0 && (
        <div className="flex items-center justify-center mb-3 mt-1 gap-2 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 group-hover:border-indigo-300 transition-all duration-200" style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          {validImages.length > 1 && (
            <button
              className="px-2 py-1 text-2xl font-bold text-gray-600 hover:text-gray-900 z-10 flex-shrink-0"
              style={{ height: '220px', display: 'flex', alignItems: 'center', background: 'none', borderRadius: 0, boxShadow: 'none', position: 'absolute', left: 0, top: 0, bottom: 0 }}
              onClick={e => { e.stopPropagation(); setCurrentImg((prev) => (prev - 1 + validImages.length) % validImages.length); }}
              aria-label="Previous image"
              type="button"
            >
              &#8592;
            </button>
          )}
          <img
            src={validImages[currentImg]}
            alt={`Product ${productName} image ${currentImg + 1}`}
            style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '8px', background: 'white', display: 'block', margin: '0 auto', transition: 'transform 0.2s', boxShadow: '0 1px 6px 0 rgba(99,102,241,0.06)' }}
          />
          {validImages.length > 1 && (
            <button
              className="px-2 py-1 text-2xl font-bold text-gray-600 hover:text-gray-900 z-10 flex-shrink-0"
              style={{ height: '220px', display: 'flex', alignItems: 'center', background: 'none', borderRadius: 0, boxShadow: 'none', position: 'absolute', right: 0, top: 0, bottom: 0 }}
              onClick={e => { e.stopPropagation(); setCurrentImg((prev) => (prev + 1) % validImages.length); }}
              aria-label="Next image"
              type="button"
            >
              &#8594;
            </button>
          )}
        </div>
      )}
      {/* Edit button at top right for admin */}
      {isAdmin && !editing && (
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-700 text-xs whitespace-nowrap z-10 flex items-center justify-center shadow-md transition-all duration-200"
          onClick={e => { e.stopPropagation(); handleRemove(); }}
          aria-label="Remove"
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {/* Move product name closer to image */}
      <div className="mb-2"></div>
      {/* Not Available badge */}
      {quantity === 0 && (
        <div className="mb-2 text-red-600 font-semibold text-center w-full text-sm">Not Available</div>
      )}
      {/* Editable fields for admin */}
      {isAdmin && editing ? (
        <>
          <input
            type="text"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            className="mb-2 text-base font-semibold border rounded-full px-3 py-1 w-full shadow-sm"
          />
          <input
            type="text"
            value={tempPrice}
            onChange={e => setTempPrice(e.target.value)}
            className="mb-2 text-sm border rounded-full px-3 py-1 w-full shadow-sm"
          />
        </>
      ) : (
        <>
          <div className="mb-1 text-lg font-bold text-center w-full text-gray-800 truncate rounded-full bg-indigo-50/60 px-3 py-1 shadow-inner" title={productName}>{productName}</div>
          {/* Show price for guests and users */}
          {!isAdmin && (
            <div className="text-base font-semibold text-center w-full mb-2 text-indigo-600">₱{Number(productPrice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
          )}
        </>
      )}
      <div className="flex items-center gap-2 justify-center w-full mt-2">
        {isAdmin ? (
          <>
            <div className="flex flex-col gap-2 max-w-full items-center w-full">
              <div className="flex flex-wrap items-center justify-center w-full">
                <div className="flex items-center gap-2 justify-center">
                  <label className="text-sm font-medium">Qty:</label>
                  <input
                    type="number"
                    min="0"
                    value={editing ? tempQty : quantity}
                    onChange={editing ? handleQtyInput : undefined}
                    className="w-16 px-2 py-1 border rounded"
                    readOnly={!editing}
                    style={{ minWidth: 0 }}
                  />
                  {editing && (
                    <>
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs whitespace-nowrap"
                        onClick={handleConfirm}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 text-xs whitespace-nowrap"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                <div className="text-sm font-semibold ml-2">₱{Number(productPrice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
              </div>
              {/* Edit button directly under Qty for admin */}
              {!editing && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs font-semibold mx-auto block"
                  style={{ maxWidth: '180px', width: '100%' }}
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className={`text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ${isGuest || quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 bg-indigo-600 scale-105'}`}
              style={{ backgroundColor: quantity === 0 ? '#d1d5db' : '#6366f1', fontSize: '1rem', letterSpacing: '0.01em', boxShadow: '0 2px 12px 0 #6366f1aa' }}
              disabled={isGuest || quantity === 0}
            >
              Buy Now
            </button>
            {!isGuest && (
              <>
                <span
                  className={`rounded-full p-2 transition border-2 border-indigo-300 shadow-lg ${quantity === 0 ? 'bg-gray-200 opacity-40 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200 scale-110 cursor-pointer'}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (quantity > 0) {
                      setShowAddModal(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  title={quantity === 0 ? "Item not available" : "Add to Cart"}
                  style={{
                    marginLeft: '6px',
                    marginRight: '2px',
                    background: quantity === 0 ? '#e5e7eb' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: quantity === 0 ? '2px solid #d1d5db' : '2px solid #6366f1',
                    boxShadow: quantity === 0 ? 'none' : '0 2px 12px 0 #6366f1aa',
                  }}
                >
                  <img src={addToCartIcon} alt="Add to Cart" className="w-6 h-6" style={{ filter: quantity === 0 ? 'grayscale(100%)' : 'drop-shadow(0 0 2px #6366f1) drop-shadow(0 0 6px #6366f1aa)' }} />
                </span>
                <AddToCartModal
                  open={showAddModal}
                  onClose={e => {
                    setShowAddModal(false);
                  }}
                  onConfirm={qtyNum => {
                    if (typeof onAddToCart === 'function') {
                      onAddToCart(qtyNum, { name: productName, price: productPrice, images, stock: quantity, quantity: quantity });
                    }
                    setShowAddModal(false);
                  }}
                  maxQty={quantity}
                  productName={productName}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductCard;
