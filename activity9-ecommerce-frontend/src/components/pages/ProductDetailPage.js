import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../layout/header';
import SideNav from '../layout/sideNav';
import ProductDetail from '../product/ProductDetail';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, isAdmin, isGuest } = location.state || {};

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
            className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Back to Products
          </button>
          <ProductDetail product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
