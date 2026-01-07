// Removed archive logic and references
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import SideNav from "../layout/sideNav";
import ProductCard from "../product/ProductCard";
import ProductGrid from "../product/ProductGrid";
import Pagination from "../layout/Pagination";
import filterByPrice from "../../utils/filterByPrice";
import ArrowDown from "../../assets/icons/arrowDown.png";

const GuestHome = () => {
  const navigate = useNavigate();
  const [isPriceAsc, setIsPriceAsc] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;
  // Load products from localStorage
  const [products, setProducts] = React.useState(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  });
  const totalProducts = products.length;
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
  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset filters handler for Home/TechStock
  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setCurrentPage(1);
  };

  // Handler for product click
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product, isAdmin: false, isGuest: true } });
  };

  return (
    <>
      <Header isGuest={true} onHome={handleHome} />
      <div className="flex bg-gradient-to-br from-indigo-100 via-white to-indigo-200 min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300">
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isAdmin={false}
        />
        <div className="flex-1 min-h-0 flex flex-col bg-white/80 rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300">
          <div className="m-6 text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit" onClick={handleToggle}>
            Filter by Price
            <img
              src={ArrowDown}
              alt="Toggle Arrow"
              className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
            />
          </div>
          <div className="flex-1 px-2 md:px-8 pb-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl h-full flex items-center justify-center">
              {selectedCategory && !selectedProduct ? (
                <div className="text-gray-400 text-lg font-semibold w-full h-full flex items-center justify-center">Select a product to view items.</div>
              ) : (
                <ProductGrid products={paginatedProducts} isGuest={true} />
              )}
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default GuestHome;
