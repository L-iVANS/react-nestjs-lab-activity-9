import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductById } from '../../services/productService';
import { useTheme } from '../../context/ThemeContext';
import Header from '../layout/header';
import SideNav from '../layout/sideNav';
import ProductDetail from '../product/ProductDetail';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { product: initialProduct, isAdmin, isGuest } = location.state || {};
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(true);

  // Fetch fresh product data from backend to get current stock
  useEffect(() => {
    const fetchFreshProduct = async () => {
      if (!initialProduct?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const freshProduct = await getProductById(initialProduct.id, token);
        console.log('Fetched fresh product from backend:', freshProduct);
        setProduct(freshProduct);
      } catch (error) {
        console.error('Failed to fetch fresh product:', error);
        // Fall back to the passed product if fetch fails
        setProduct(initialProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshProduct();
  }, [initialProduct?.id, token]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">No product selected</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header isAdmin={isAdmin} isGuest={isGuest} onHome={handleBack} />
      <div className="flex">
        <SideNav isAdmin={isAdmin} />
        <div className="flex-1 p-8">
          <button 
            onClick={handleBack}
            className={`mb-6 px-4 py-2 rounded transition font-semibold ${
              isDarkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            ← Back to Products
          </button>
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <p>Loading product details...</p>
            </div>
          ) : (
            <ProductDetail product={product} />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
