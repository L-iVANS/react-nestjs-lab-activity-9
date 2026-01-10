import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductById } from '../../services/productService';
import { useTheme } from '../../context/ThemeContext';
import Header from '../layout/header';
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
      <div className={`flex min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200'
      }`}>
        <div className={`flex-1 min-h-0 flex flex-col relative rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'
        }`}>
          <button 
            onClick={handleBack}
            className={`mb-6 px-6 py-2.5 rounded-lg transition font-semibold w-fit flex items-center gap-2 border-2 ${
              isDarkMode 
                ? 'bg-gray-700/80 text-gray-100 hover:bg-gray-600 border-gray-600 hover:border-gray-500 shadow-lg' 
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200 border-purple-300 hover:border-purple-400 shadow-md hover:shadow-lg'
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
