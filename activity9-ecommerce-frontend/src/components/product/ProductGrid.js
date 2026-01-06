import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, isAdmin, isGuest, onAddToCart, onRemove, onRemoveProduct }) => {
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
      <div className="grid grid-cols-4 grid-rows-2 gap-8 px-8">
        {products.slice(0, 8).map((product, idx) => (
          <ProductCard
            key={idx}
            name={product.name}
            price={product.price}
            images={product.images}
            isAdmin={isAdmin}
            isGuest={isGuest}
            onAddToCart={onAddToCart}
            onRemove={() => handleRemove && handleRemove(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
