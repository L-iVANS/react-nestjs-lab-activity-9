import { useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  });
  const [archivedProducts, setArchivedProducts] = useState(() => {
    const stored = localStorage.getItem('archivedProducts');
    return stored ? JSON.parse(stored) : [];
  });

  const addProduct = (product) => {
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const archiveProduct = (product) => {
    const updatedProducts = products.filter(p => p !== product);
    const updatedArchived = [product, ...archivedProducts];
    setProducts(updatedProducts);
    setArchivedProducts(updatedArchived);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    localStorage.setItem('archivedProducts', JSON.stringify(updatedArchived));
  };

  const restoreProduct = (product) => {
    const updatedArchived = archivedProducts.filter(p => p !== product);
    const updatedProducts = [product, ...products];
    setArchivedProducts(updatedArchived);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    localStorage.setItem('archivedProducts', JSON.stringify(updatedArchived));
  };

  return {
    products,
    setProducts,
    archivedProducts,
    setArchivedProducts,
    addProduct,
    archiveProduct,
    restoreProduct,
  };
}
