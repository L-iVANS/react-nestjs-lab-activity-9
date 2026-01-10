import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProducts } from "../../services/productService";
import Header from "../layout/header";
import HistoryIcon from "../../assets/icons/HistoryIcon";
import CartIconOverlay from "../layout/CartIconOverlay";
import SideNav from "../layout/sideNav";
import ArrowDown from "../../assets/icons/arrowDown.png";
import ProductCard from "../product/ProductCard";
import ProductGrid from "../product/ProductGrid";
import Pagination from "../layout/Pagination";
import filterByPrice from "../../utils/filterByPrice";
import { useTheme } from "../../context/ThemeContext";


const Home = () => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts(token);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token, refreshTrigger]);
  const navigate = useNavigate();
  const [isPriceAsc, setIsPriceAsc] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setCurrentPage(1);
  };
  // Pagination logic
  const productsPerPage = 8;
  const totalProducts = products.length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Filter and sort products by price
  let filteredProducts = products;
  
  // Filter by search query first
  if (searchQuery.trim()) {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Debug logging
  console.log('Selected Category:', selectedCategory);
  console.log('Selected Product:', selectedProduct);
  console.log('All Products:', products.map(p => ({ name: p.name, category: p.category, productType: p.productType })));
  
  if (selectedCategory && selectedProduct) {
    filteredProducts = filteredProducts.filter(
      p => p.category === selectedCategory && p.productType === selectedProduct
    );
  } else if (selectedCategory && !selectedProduct) {
    filteredProducts = filteredProducts.filter(
      p => p.category === selectedCategory
    );
  }
  
  console.log('Filtered Products:', filteredProducts.length, filteredProducts.map(p => p.name));
  const sortedProducts = filterByPrice(filteredProducts, isPriceAsc);
  // Sort to put 0 quantity items at the end
  const productsWithAvailability = [...sortedProducts].sort((a, b) => {
    const aStock = a.stock || a.quantity || 0;
    const bStock = b.stock || b.quantity || 0;
    if (aStock === 0 && bStock === 0) return 0;
    if (aStock === 0) return 1;
    if (bStock === 0) return -1;
    return 0;
  });
  const paginatedProducts = productsWithAvailability.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Cart state - tracks number of items
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart count from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        setCartCount(arr.reduce((sum, item) => sum + (item.qty || 1), 0));
      } catch {
        setCartCount(0);
      }
    }
  }, []);

  // Handler for add to cart (with quantity)
  const handleAddToCart = (qty = 1, product) => {
    const stock = product.stock || product.quantity || 0;
    // Check if product has available stock
    if (stock <= 0) {
      alert('This product is out of stock');
      return;
    }
    
    // Get cart from localStorage
    let cart = [];
    try {
      const stored = localStorage.getItem('cart');
      if (stored) cart = JSON.parse(stored);
    } catch {}
    // Check if product already in cart
    const idx = cart.findIndex(item => item.name === product.name);
    if (idx > -1) {
      cart[idx].qty += qty;
      // Ensure images property is always present and up-to-date
      cart[idx].images = product.images || [];
    } else {
      cart.push({ ...product, qty, images: product.images || [] });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
    
    // Refresh products to show updated stock
    setRefreshTrigger(prev => prev + 1);
  };

  // Handler for product click
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product, isAdmin: false, isGuest: false } });
  };

  return (
    <>
      <Header onHome={handleHome} onSearch={setSearchQuery} />
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
        <div className={`flex-1 min-h-0 flex flex-col relative rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'
        }`}>
          <div className="flex items-center justify-between m-6">
            {/* Filter by Price - left (copied from AdminHome) */}
            <div
              className={`text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit px-4 py-2 rounded-xl shadow-sm transition ${
                isDarkMode 
                  ? 'bg-gray-700 border border-gray-600 text-indigo-400 hover:bg-gray-600' 
                  : 'bg-indigo-50 border border-indigo-100 hover:bg-indigo-100'
              }`}
              onClick={handleToggle}
              style={{ fontWeight: 600, color: isDarkMode ? '#a78bfa' : '#6366f1', letterSpacing: '0.01em' }}
            >
              Filter by Price
              <img
                src={ArrowDown}
                alt="Toggle Arrow"
                className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
                style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
              />
            </div>
            {/* Cart icon - right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/orders')}
                style={{
                  background: isDarkMode ? '#374151' : '#eef2ff',
                  border: isDarkMode ? '2px solid #a78bfa' : '2px solid #6366f1',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  marginRight: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: isDarkMode ? '#a78bfa' : '#7c3aed',
                  fontSize: '0.92rem',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
                  transition: 'background 0.2s',
                }}
                title="View Purchase History"
              >
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isDarkMode ? '#a78bfa' : '#7c3aed', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HistoryIcon size={22} color={isDarkMode ? '#a78bfa' : '#7c3aed'} />
                  Purchase History
                </span>
              </button>
              <CartIconOverlay onClick={() => navigate('/cart')} count={cartCount} small />
            </div>
          </div>
          <div className="flex-1 px-2 md:px-8 pb-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl h-full flex items-center justify-center">
              {selectedCategory && !selectedProduct ? (
                <div className={`text-lg font-semibold w-full h-full flex items-center justify-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`}>Select a product to view items.</div>
              ) : (
                <ProductGrid products={paginatedProducts} onAddToCart={(qty, product) => handleAddToCart(qty, product)} onProductClick={handleProductClick} />
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
