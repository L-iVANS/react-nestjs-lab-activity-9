import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';


const ProductDetail = ({ product }) => {
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const quantityRef = React.useRef(null);

  // Get stock directly from product - no intermediate state needed
  const stockLeft = product?.stock ?? product?.quantity ?? 0;

  // Debug logging
  React.useEffect(() => {
    console.log('ProductDetail - product object:', product);
    console.log('ProductDetail - stock value:', product?.stock);
    console.log('ProductDetail - quantity value:', product?.quantity);
    console.log('ProductDetail - stockLeft (computed):', stockLeft);
  }, [product, stockLeft]);




  if (!product) {
    return <div>No product selected.</div>;
  }

  const {
    name,
    price,
    images = [],
  } = product;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (stockLeft && newQty > stockLeft) return stockLeft;
      return newQty;
    });
  };

  const handleImageChange = (delta) => {
    setCurrentImage((prev) => {
      const total = images.length;
      return (prev + delta + total) % total;
    });
  };

  const handleAddToCart = () => {
    // Get fresh stock value from product
    const currentStock = product?.stock ?? product?.quantity ?? 0;
    console.log('handleAddToCart called');
    console.log('product:', product);
    console.log('currentStock (fresh from product):', currentStock);
    console.log('quantity:', quantity);
    console.log('Check: quantity > currentStock =', quantity > currentStock);
    console.log('Check: currentStock <= 0 =', currentStock <= 0);
    
    // Simple check: can we add this quantity?
    if (currentStock <= 0) {
      console.log('Product out of stock');
      setToastMessage("This product is out of stock!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    
    if (quantity > currentStock) {
      console.log('Quantity exceeds stock');
      setToastMessage(`Only ${currentStock} available, but you're trying to add ${quantity}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    const stored = localStorage.getItem("cart");
    const cartItems = stored ? JSON.parse(stored) : [];

    const existingIdx = cartItems.findIndex((item) => item.name === product.name);
    const numericPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;

    const baseItem = {
      name: product.name,
      price: numericPrice,
      images: product.images || [],
      qty: quantity,
      stock: currentStock,
    };

    let delta = quantity;

    if (existingIdx !== -1) {
      const existing = cartItems[existingIdx];
      const existingQty = existing.qty || 0;
      const desired = existingQty + quantity;
      const allowed = Math.min(desired, currentStock);
      delta = allowed - existingQty;
      if (delta <= 0) {
        setToastMessage("Not enough stock for this product!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
      cartItems[existingIdx] = { ...existing, qty: allowed };
    } else {
      delta = Math.min(quantity, currentStock);
      if (delta <= 0) {
        setToastMessage("Not enough stock for this product!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
      cartItems.push({ ...product, ...baseItem, qty: delta });
    }

    // Keep localStorage in sync for persistence
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // Note: Stock is NOT reduced here. It will be reduced when order is actually placed via backend API
    console.log('Product added to cart, navigating to cart page');
    navigate('/cart');
  };



  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#f87171',
          color: '#fff',
          padding: '18px 32px',
          borderRadius: '12px',
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
          zIndex: 9999,
          textAlign: 'center',
        }}>
          {toastMessage || 'Not enough stock for this Product!'}
        </div>
      )}
      {/* Left: Product Images */}
      <div style={{ flex: 1 }}>
        <div style={{ position: 'relative', width: 350, height: 350, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600 }}>
          {images.length > 1 && (
            <button onClick={() => handleImageChange(-1)} style={{ position: 'absolute', left: 10, background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              &#8592;
            </button>
          )}
          {images.length > 0 ? (
            <img src={images[currentImage]} alt="Product" style={{ maxWidth: '90%', maxHeight: '90%' }} />
          ) : (
            <span>Product Photo</span>
          )}
          {images.length > 1 && (
            <button onClick={() => handleImageChange(1)} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              &#8594;
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              style={{ width: 80, height: 80, objectFit: 'cover', border: currentImage === idx ? '2px solid #333' : '2px solid #ccc', cursor: 'pointer' }}
              onClick={() => setCurrentImage(idx)}
            />
          ))}
        </div>
      </div>
      {/* Right: Product Info */}
      <div style={{ flex: 1, minWidth: 320, marginLeft: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{name || 'Product Name'}</h2>
        <div style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px 0' }}>
          Stock Count: <span style={{ color: stockLeft > 0 ? 'green' : 'red', fontWeight: 700 }}>{typeof stockLeft === 'number' ? stockLeft : 0}</span>
        </div>
        <hr style={{ margin: '8px 0 16px 0' }} />
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          {price ? `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱0.00'}
        </div>
        <div style={{ fontSize: 14, marginBottom: 8 }} ref={quantityRef}>Quantity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <input 
            type="text" 
            value={quantity} 
            readOnly 
            style={{ 
              width: 40, 
              textAlign: 'center', 
              fontSize: 16, 
              background: isDarkMode ? '#1f2937' : '#fff', 
              color: isDarkMode ? '#f3f4f6' : '#222', 
              border: isDarkMode ? '1px solid #4b5563' : '1px solid #ccc',
              borderRadius: 6
            }} 
          />
          <button 
            onClick={() => handleQuantityChange(1)} 
            style={{ padding: '2px 8px', fontSize: 16, cursor: stockLeft < 1 ? 'not-allowed' : 'pointer', opacity: stockLeft < 1 ? 0.5 : 1 }}
            disabled={stockLeft < 1}
          >+
          </button>
          <button onClick={() => handleQuantityChange(-1)} style={{ padding: '2px 8px', fontSize: 16 }}>-</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '2px solid #a855f7',
              color: '#a855f7',
              background: '#fff',
              cursor: stockLeft >= 1 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
              opacity: stockLeft >= 1 ? 1 : 0.5
            }}
            onClick={handleAddToCart}
            disabled={stockLeft < 1}
          >
            Add To Cart <span role="img" aria-label="cart">🛒</span>
          </button>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#22c55e',
              color: '#fff',
              cursor: stockLeft >= 1 ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              opacity: stockLeft >= 1 ? 1 : 0.5
            }}
            disabled={stockLeft < 1}
            onClick={() => {
              if (stockLeft >= quantity) {
                navigate('/checkout', {
                  state: {
                    product: {
                      ...product,
                      qty: quantity
                    }
                  }
                });
              } else {
                setToastMessage('Not enough stock for this product!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
              }
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
