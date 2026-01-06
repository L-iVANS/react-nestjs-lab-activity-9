import React from "react";
import ProductGrid from "../product/ProductGrid";

const ArchivedProducts = ({ archivedProducts, onRestore }) => (
  <>
    <div className="flex items-center justify-between m-6">
      <h2 className="text-2xl font-bold">Archived Products</h2>
    </div>
    <ProductGrid products={archivedProducts} isAdmin={true} onAddToCart={null} onRemove={onRestore} />
  </>
);

export default ArchivedProducts;
