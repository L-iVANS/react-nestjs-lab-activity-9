// Removed archive logic and references
import React, { useState } from "react";
import Header from "../layout/header";
import CartIconOverlay from "../layout/CartIconOverlay";
import SideNav from "../layout/sideNav";
import ArrowDown from "../../assets/icons/arrowDown.png";
import ProductCard from "../product/ProductCard";
import ProductGrid from "../product/ProductGrid";
import Pagination from "../layout/Pagination";
import filterByPrice from "../../utils/filterByPrice";


const Home = () => {
  const [isPriceAsc, setIsPriceAsc] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  // Pagination logic
  const productsPerPage = 8;
  // Load products from localStorage
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  });
  const totalProducts = products.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Filter and sort products by price
  let filteredProducts = products;
  if (selectedCategory && selectedProduct) {
    filteredProducts = products.filter(
      p => p.category === selectedCategory && p.product === selectedProduct
    );
  } else if (selectedCategory && !selectedProduct) {
    filteredProducts = [];
  }
  const sortedProducts = filterByPrice(filteredProducts, isPriceAsc);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Cart state
  const [cartCount, setCartCount] = useState(0);
  // Reset filters handler for Home/TechStock
  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setCurrentPage(1);
  };

  // Handler for add to cart
  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
  };

  return (
    <>
      <Header onHome={handleHome} />
      <div className="flex">
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isAdmin={false}
        />
        <div className="flex-1 min-h-0 flex flex-col relative" style={{height: '100vh'}}>
          <div className="flex items-center justify-between m-6">
            {/* Filter by Price - left */}
            <div className="text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit" onClick={handleToggle}>
              Filter by Price
              <img
                src={ArrowDown}
                alt="Toggle Arrow"
                className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
              />
            </div>
            {/* Cart icon - right */}
            <div className="flex items-center gap-2">
              <CartIconOverlay onClick={() => alert('Show cart!')} count={cartCount} small />
            </div>
          </div>
          <div className="flex-1 px-2 md:px-8 pb-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl h-full flex items-center justify-center">
              {selectedCategory && !selectedProduct ? (
                <div className="text-gray-400 text-lg font-semibold w-full h-full flex items-center justify-center">Select a product to view items.</div>
              ) : (
                <ProductGrid products={paginatedProducts} onAddToCart={handleAddToCart} />
              )}
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default Home;
