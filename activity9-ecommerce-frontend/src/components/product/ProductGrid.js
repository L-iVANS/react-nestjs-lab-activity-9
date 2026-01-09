import React from "react";
import ProductCard from "./ProductCard";
import { useTheme } from "../../context/ThemeContext";

const ProductGrid = ({ products, isAdmin, isGuest, onAddToCart, onRemove, onRemoveProduct, onProductClick, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const handleRemove = onRemove || onRemoveProduct;
  
  if (!products || products.length === 0) {
    return (
      <div className={`col-span-4 row-span-2 flex items-center justify-center text-lg font-semibold opacity-70 w-full h-full ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        No products available.
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-4 grid-rows-2 gap-8 px-8 transition-all duration-300 bg-transparent">
        {products.slice(0, 8).map((product, idx) => {
          const stock = product.stock || product.quantity || 0;
          return (
            <div key={idx} style={{ cursor: stock === 0 ? 'not-allowed' : onProductClick ? 'pointer' : 'default' }}
              onClick={() => stock > 0 && onProductClick && onProductClick(product)}>
              <ProductCard
                productId={product.id || 'N/A'}
                productName={product.name}
                productPrice={product.price}
                images={product.images}
                isAdmin={isAdmin}
                isGuest={isGuest}
                quantity={stock}
                onAddToCart={onAddToCart}
                onRemove={() => handleRemove && handleRemove(idx)}
                onUpdate={onUpdate && ((updates) => onUpdate(idx, updates))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
