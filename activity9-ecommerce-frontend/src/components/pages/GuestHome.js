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
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const GuestHome = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isDarkMode } = useTheme();

  // Redirect if already logged in
  React.useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  const [isPriceAsc, setIsPriceAsc] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;
  // Fetch products from API
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
    navigate('/login');
  };

  return (
    <>
      <Header isGuest={true} onHome={handleHome} />
      <div className={`flex min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200'
      }`}>
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isAdmin={false}
        />
        <div className={`flex-1 min-h-0 flex flex-col rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'
        }`}>
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
              {loading ? (
                <div className="text-gray-400 text-lg font-semibold">Loading products...</div>
              ) : selectedCategory && !selectedProduct ? (
                <div className="text-gray-400 text-lg font-semibold w-full h-full flex items-center justify-center">Select a product to view items.</div>
              ) : (
                <ProductGrid products={paginatedProducts} isGuest={true} onProductClick={handleProductClick} />
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
