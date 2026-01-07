import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, isAdmin, isGuest, onAddToCart, onRemove, onRemoveProduct, onProductClick }) => {
  const handleRemove = onRemove || onRemoveProduct;
  
  if (!products || products.length === 0) {
    return (
      <div className="col-span-4 row-span-2 flex items-center justify-center text-gray-400 text-lg font-semibold opacity-70 w-full h-full">
        No products available.
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-4 grid-rows-2 gap-8 px-8 transition-all duration-300 bg-transparent">
        {products.slice(0, 8).map((product, idx) => (
          <div key={idx} style={{ cursor: onProductClick ? 'pointer' : 'default' }}
            onClick={() => onProductClick && onProductClick(product)}>
            <ProductCard
              productName={product.name}
              productPrice={product.price}
              images={product.images}
              isAdmin={isAdmin}
              isGuest={isGuest}
              quantity={product.quantity || 1}
              onAddToCart={onAddToCart}
              onRemove={() => handleRemove && handleRemove(idx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
