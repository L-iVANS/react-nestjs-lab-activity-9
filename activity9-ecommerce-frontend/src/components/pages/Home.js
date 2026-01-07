// Removed archive logic and references
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import HistoryIcon from "../../assets/icons/HistoryIcon";
import CartIconOverlay from "../layout/CartIconOverlay";
import SideNav from "../layout/sideNav";
import ArrowDown from "../../assets/icons/arrowDown.png";
import ProductCard from "../product/ProductCard";
import ProductGrid from "../product/ProductGrid";
import Pagination from "../layout/Pagination";
import filterByPrice from "../../utils/filterByPrice";


const Home = () => {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    window.setProducts = setProducts;
    return () => { window.setProducts = null; };
  }, [setProducts]);
  const navigate = useNavigate();
  const [isPriceAsc, setIsPriceAsc] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  // Pagination logic
  const productsPerPage = 8;
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
  // Sort to put 0 quantity items at the end
  const productsWithAvailability = [...sortedProducts].sort((a, b) => {
    if ((a.quantity || 1) === 0 && (b.quantity || 1) === 0) return 0;
    if ((a.quantity || 1) === 0) return 1;
    if ((b.quantity || 1) === 0) return -1;
    return 0;
  });
  const paginatedProducts = productsWithAvailability.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Cart state
  const [cartCount, setCartCount] = useState(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        return arr.reduce((sum, item) => sum + (item.qty || 1), 0);
      } catch {
        return 0;
      }
    }
    return 0;
  });
  // Reset filters handler for Home/TechStock
  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setCurrentPage(1);
  };

  // Handler for add to cart (with quantity)
  const handleAddToCart = (qty = 1, product) => {
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
  };

  // Handler for product click
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product, isAdmin: false, isGuest: false } });
  };

  return (
    <>
      <Header onHome={handleHome} />
      <div className="flex bg-gradient-to-br from-indigo-100 via-white to-indigo-200 min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300">
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isAdmin={false}
        />
        <div className="flex-1 min-h-0 flex flex-col relative bg-white/80 rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300">
          <div className="flex items-center justify-between m-6">
            {/* Filter by Price - left */}
            <div
              className="text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm hover:bg-indigo-100 transition"
              onClick={handleToggle}
              style={{ fontWeight: 600, color: '#6366f1', letterSpacing: '0.01em' }}
            >
              Filter by Price
              <img
                src={ArrowDown}
                alt="Toggle Arrow"
                className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
              />
            </div>
            {/* Cart icon - right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/orders')}
                style={{
                  background: '#eef2ff',
                  border: '2px solid #6366f1',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  marginRight: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: '#7c3aed',
                  fontSize: '0.92rem',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
                  transition: 'background 0.2s',
                }}
                title="View Purchase History"
              >
      
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#7c3aed', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HistoryIcon size={22} color="#7c3aed" />
                  Purchase History
                </span>
              </button>
              <CartIconOverlay onClick={() => navigate('/cart')} count={cartCount} small />
            </div>
          </div>
          <div className="flex-1 px-2 md:px-8 pb-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl h-full flex items-center justify-center">
              {selectedCategory && !selectedProduct ? (
                <div className="text-gray-400 text-lg font-semibold w-full h-full flex items-center justify-center">Select a product to view items.</div>
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
