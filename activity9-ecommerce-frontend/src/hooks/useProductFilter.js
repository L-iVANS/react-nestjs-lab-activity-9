import { useMemo } from "react";

export default function useProductFilter(products, selectedCategory, selectedProduct, currentPage, productsPerPage) {
  let filteredProducts = products;
  if (selectedCategory && selectedProduct) {
    filteredProducts = products.filter(
      p => p.category === selectedCategory && p.product === selectedProduct
    );
  } else if (selectedCategory && !selectedProduct) {
    filteredProducts = [];
  }

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    ),
    [filteredProducts, currentPage, productsPerPage]
  );

  return { filteredProducts, paginatedProducts };
}
