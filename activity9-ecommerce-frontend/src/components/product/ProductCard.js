import React from "react";
import addToCartIcon from "../../assets/icons/qlementine-icons_add-to-cart-16.png";

const ProductCard = ({ name, price, isGuest, isAdmin, images, onAddToCart, onRemove }) => {
  const [currentImg, setCurrentImg] = React.useState(0);
  React.useEffect(() => { setCurrentImg(0); }, [images]);

  const [quantity, setQuantity] = React.useState(1);
  const [productName, setProductName] = React.useState(name);
  const [productPrice, setProductPrice] = React.useState(price);
  const [editing, setEditing] = React.useState(false);
  const [tempQty, setTempQty] = React.useState(quantity);
  const [tempName, setTempName] = React.useState(productName);
  const [tempPrice, setTempPrice] = React.useState(productPrice);

  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove();
    } else {
      alert("Remove item clicked! (No handler provided)");
    }
  };

  const handleEdit = () => {
    setTempQty(quantity);
    setTempName(productName);
    setTempPrice(productPrice);
    setEditing(true);
  };

  const handleQtyInput = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setTempQty(val);
  };

  const handleConfirm = () => {
    setQuantity(tempQty);
    setProductName(tempName);
    setProductPrice(tempPrice);
    setEditing(false);
    alert(`Product updated!`);
  };

  const handleCancel = () => {
    setTempQty(quantity);
    setTempName(productName);
    setTempPrice(productPrice);
    setEditing(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-end shadow-sm w-full h-full min-h-0 relative" style={{ width: '260px' }}>
      {/* Product Images */}
      {Array.isArray(images) && images.length > 0 && (
        <div className="flex items-center justify-center mb-2 mt-2 gap-2" style={{ width: '200px', height: '220px', margin: '0 auto', position: 'relative' }}>
          {images.length > 1 && (
            <button
              className="px-2 py-1 text-2xl font-bold text-gray-600 hover:text-gray-900 z-10 flex-shrink-0"
              style={{ height: '220px', display: 'flex', alignItems: 'center', background: 'none', borderRadius: 0, boxShadow: 'none', position: 'absolute', left: 0, top: 0, bottom: 0 }}
              onClick={e => { e.stopPropagation(); setCurrentImg((prev) => (prev - 1 + images.length) % images.length); }}
              aria-label="Previous image"
              type="button"
            >
              &#8592;
            </button>
          )}
          <img
            src={images[currentImg]}
            alt={`Product ${productName} image ${currentImg + 1}`}
            style={{ width: '200px', height: '220px', objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', display: 'block', margin: '0 auto' }}
          />
          {images.length > 1 && (
            <button
              className="px-2 py-1 text-2xl font-bold text-gray-600 hover:text-gray-900 z-10 flex-shrink-0"
              style={{ height: '220px', display: 'flex', alignItems: 'center', background: 'none', borderRadius: 0, boxShadow: 'none', position: 'absolute', right: 0, top: 0, bottom: 0 }}
              onClick={e => { e.stopPropagation(); setCurrentImg((prev) => (prev + 1) % images.length); }}
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
          className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs whitespace-nowrap z-10 flex items-center justify-center"
          onClick={handleRemove}
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
      {/* Editable fields for admin */}
      {isAdmin && editing ? (
        <>
          <input
            type="text"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            className="mb-2 text-base font-semibold border rounded px-2 py-1 w-full"
          />
          <input
            type="text"
            value={tempPrice}
            onChange={e => setTempPrice(e.target.value)}
            className="mb-2 text-sm border rounded px-2 py-1 w-full"
          />
        </>
      ) : (
        <>
          <div className="mb-2 text-base font-semibold text-center w-full">{productName}</div>
          {/* Show price for guests and users */}
          {!isAdmin && (
            <div className="text-sm font-semibold text-center w-full mb-2">₱{productPrice}</div>
          )}
        </>
      )}
      <div className="flex items-center gap-2 justify-center w-full">
        {isAdmin ? (
          <>
            <div className="flex flex-col gap-2 max-w-full items-center w-full">
              <div className="flex flex-wrap items-center justify-center w-full">
                <div className="flex items-center gap-2 justify-center">
                  <label className="text-sm font-medium">Qty:</label>
                  <input
                    type="number"
                    min="1"
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
                <div className="text-sm font-semibold ml-2">₱{productPrice}</div>
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
              className={`text-white font-bold py-2 px-6 rounded transition ${isGuest ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110'}`}
              style={{ backgroundColor: 'var(--accent-color)' }}
              disabled={isGuest}
              onClick={isGuest ? undefined : () => alert('Buy Now clicked!')}
            >
              Buy Now
            </button>
            {!isGuest && (
              <span
                className="bg-gray-300 rounded p-2 hover:bg-gray-400 transition cursor-pointer"
                onClick={onAddToCart}
                role="button"
                tabIndex={0}
              >
                <img src={addToCartIcon} alt="Add to Cart" className="w-6 h-6" />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
