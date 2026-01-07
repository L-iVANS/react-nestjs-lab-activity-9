import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const quantityRef = React.useRef(null);




  if (!product) {
    return <div>No product selected.</div>;
  }

  const {
    name,
    stock,
    price,
    images = [],
  } = product;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (stock && newQty > stock) return stock;
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
    if (stock >= 1) {
      navigate('/cart');
    }
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
          Not enough stock for this Product!
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
          Stock Count: <span style={{ color: stock > 0 ? 'green' : 'red', fontWeight: 700 }}>{typeof stock === 'number' ? stock : 0}</span>
        </div>
        <hr style={{ margin: '8px 0 16px 0' }} />
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          {price ? `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱0.00'}
        </div>
        <div style={{ fontSize: 14, marginBottom: 8 }} ref={quantityRef}>Quantity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <input type="text" value={quantity} readOnly style={{ width: 40, textAlign: 'center', fontSize: 16 }} />
          <button 
            onClick={() => handleQuantityChange(1)} 
            style={{ padding: '2px 8px', fontSize: 16, cursor: stock < 1 ? 'not-allowed' : 'pointer', opacity: stock < 1 ? 0.5 : 1 }}
            disabled={stock < 1}
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
              cursor: stock >= 1 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
              opacity: stock >= 1 ? 1 : 0.5
            }}
            onClick={handleAddToCart}
            disabled={stock < 1}
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
              cursor: stock >= 1 ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              opacity: stock >= 1 ? 1 : 0.5
            }}
            disabled={stock < 1}
            onClick={() => {
              if (stock >= quantity) {
                navigate('/checkout', {
                  state: {
                    product: {
                      ...product,
                      qty: quantity
                    }
                  }
                });
              } else {
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
