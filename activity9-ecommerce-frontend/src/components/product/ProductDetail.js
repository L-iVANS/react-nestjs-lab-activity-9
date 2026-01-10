import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  getGradientBg,
  getToastStyle,
  getImageNavigationButtonStyle,
  getImageContainerStyle,
  getThumbnailStyle,
  getProductInfoContainerStyle,
  getQuantityInputStyle,
  getQuantityButtonStyle,
  getAddToCartButtonStyle,
  getBuyNowButtonStyle,
  getTextColor,
} from '../../utils/themeStyles';


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
    return <div style={getTextColor(isDarkMode)}>No product selected.</div>;
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
      let next = prev + delta;
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      return next;
    });
  };

  const handleAddToCart = () => {
    const currentStock = stockLeft;
    
    // Check if product is out of stock
    if (currentStock === 0) {
      setToastMessage("This product is out of stock!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    
    // Check if trying to add more than available stock
    if (quantity > currentStock) {
      setToastMessage(`Only ${currentStock} available, but you're trying to add ${quantity}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    const stored = localStorage.getItem("cart");
    const cartItems = stored ? JSON.parse(stored) : [];

    const existingIdx = cartItems.findIndex((item) => item.name === product.name);
    const numericPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;

    if (existingIdx !== -1) {
      // Product already in cart - check if we can add more
      const existing = cartItems[existingIdx];
      const existingQty = existing.qty || 0;
      const desired = existingQty + quantity;
      
      if (desired > currentStock) {
        setToastMessage(`Only ${currentStock} total available. Already have ${existingQty} in cart.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
      
      cartItems[existingIdx] = { ...existing, qty: desired };
    } else {
      // New product to cart - just add it
      cartItems.push({
        ...product,
        qty: quantity,
        price: numericPrice,
        images: product.images || [],
        stock: currentStock,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    console.log('Product added to cart, navigating to cart page');
    navigate('/cart');
  };

  return (
    <div style={{
      display: 'flex',
      gap: '2rem',
      alignItems: 'flex-start',
      position: 'relative',
      ...getGradientBg(isDarkMode),
      borderRadius: 24,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      ...getTextColor(isDarkMode),
      transition: 'background 0.2s, color 0.2s',
    }}>
          {showToast && (
            <div style={getToastStyle(isDarkMode)}>
              {toastMessage || 'Not enough stock for this Product!'}
            </div>
          )}
          {/* Product Detail Section */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', width: '100%' }}>
            {/* Left: Product Images */}
            <div style={{ flex: 1 }}>
              <div style={getImageContainerStyle(isDarkMode)}>
                {images.length > 1 && (
                  <button onClick={() => handleImageChange(-1)} style={{ position: 'absolute', left: 10, ...getImageNavigationButtonStyle(isDarkMode) }}>
                    &#8592;
                  </button>
                )}
                {images.length > 0 ? (
                  <img src={images[currentImage]} alt="Product" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                ) : (
                  <span style={{ color: isDarkMode ? '#f3f4f6' : '#222' }}>Product Photo</span>
                )}
                {images.length > 1 && (
                  <button onClick={() => handleImageChange(1)} style={{ position: 'absolute', right: 10, ...getImageNavigationButtonStyle(isDarkMode) }}>
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
                    style={getThumbnailStyle(isDarkMode, currentImage === idx)}
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
            </div>
            {/* Right: Product Info */}
            <div style={getProductInfoContainerStyle(isDarkMode)}>
              <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 0, marginBottom: 8, ...getTextColor(isDarkMode) }}>{name || 'Product Name'}</h2>
              <div style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px 0', ...getTextColor(isDarkMode) }}>
                Stock Count: <span style={{ color: stockLeft > 0 ? (isDarkMode ? '#10b981' : '#10b981') : (isDarkMode ? '#ef4444' : '#ef4444'), fontWeight: 700 }}>{typeof stockLeft === 'number' ? stockLeft : 0}</span>
              </div>
              <hr style={{ margin: '8px 0 16px 0', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, ...getTextColor(isDarkMode) }}>
                {price ? `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱0.00'}
              </div>
              <div style={{ fontSize: 14, marginBottom: 8, ...getTextColor(isDarkMode) }} ref={quantityRef}>Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  style={getQuantityInputStyle(isDarkMode)} 
                />
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  style={{ ...getQuantityButtonStyle(isDarkMode), cursor: stockLeft < 1 ? 'not-allowed' : 'pointer', opacity: stockLeft < 1 ? 0.5 : 1 }}
                  disabled={stockLeft < 1}
                >+
                </button>
                <button onClick={() => handleQuantityChange(-1)} style={getQuantityButtonStyle(isDarkMode)}>-</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  style={getAddToCartButtonStyle(isDarkMode, stockLeft < 1)}
                  onClick={handleAddToCart}
                  disabled={stockLeft < 1}
                >
                  Add To Cart <span role="img" aria-label="cart">🛒</span>
                </button>
                <button
                  style={getBuyNowButtonStyle(isDarkMode, stockLeft < 1)}
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
    </div>
  );
};

export default ProductDetail;