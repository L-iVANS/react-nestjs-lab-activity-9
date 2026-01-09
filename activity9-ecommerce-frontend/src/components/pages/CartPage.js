import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from '../../context/ThemeContext';

// Helper function to fetch product image
function getProductImage(item) {
  if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) {
    return item.images[0];
  }
  return "";
}

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadCartWithStock = async () => {
      const stored = localStorage.getItem("cart");
      let cartItems = stored ? JSON.parse(stored) : [];
      
      // Fetch current products from backend to get latest stock
      try {
        const products = await getAllProducts(token);
        cartItems = cartItems.map((item) => {
          const product = products.find(p => p.name === item.name);
          const currentStock = product?.stock ?? product?.quantity ?? 0;
          return {
            ...item,
            stock: currentStock
          };
        });
      } catch (error) {
        console.error('Failed to fetch product stock:', error);
        // Fallback: use stock from cart if API fails
      }
      
      // Convert prices to numbers
      const normalizedCart = cartItems.map((item) => ({
        ...item,
        price:
          typeof item.price === "string" ? parseFloat(item.price) : item.price,
      }));
      setCart(normalizedCart);
      setTotal(
        normalizedCart.reduce((sum, item) => sum + item.price * item.qty, 0)
      );
    };

    loadCartWithStock();
  }, [token]);

  const removeItem = (idx) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      // Keep localStorage in sync for persistence
      localStorage.setItem("cart", JSON.stringify(updated));
      setTotal(updated.reduce((sum, item) => sum + item.price * item.qty, 0));
      return updated;
    });
    selectedItems.delete(idx);
  };

  const toggleSelectItem = (idx) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedItems(newSelected);
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : ''}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : ''}`}>Your cart is empty</h2>
          <button
            className={`px-6 py-2 rounded font-semibold transition ${isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'}`}
            onClick={() => navigate("/home")}
          >
            Go Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200'}`}>
        <div className={`max-w-6xl mx-auto px-4 py-8 rounded-3xl shadow-xl ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'}`}>
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Shopping Cart
          </h1>
          <div className="grid grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="col-span-2">
              <div className={`${isDarkMode ? 'bg-gray-900 rounded-lg shadow-sm' : 'bg-white rounded-lg shadow-sm'}`}>
                {/* Header */}
                <div className={`grid grid-cols-10 gap-4 px-6 py-4 border-b font-semibold ${isDarkMode ? 'text-gray-200 bg-gray-800 border-gray-700' : 'text-gray-700 bg-gray-50'}`}> 
                  <div className="col-span-1">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>
                {/* Cart Items */}
                <div>
                  {cart.map((item, idx) => {
                    const isUnavailable = !item.stock || item.stock <= 0;
                    return (
                    <div
                      key={idx}
                      className={`grid grid-cols-10 gap-4 px-6 py-4 border-b items-center ${isUnavailable ? 'bg-red-50 opacity-60' : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} ${isDarkMode ? 'border-gray-700' : ''}`}
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedItems.has(idx)}
                          onChange={() => toggleSelectItem(idx)}
                          disabled={isUnavailable}
                        />
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        {getProductImage(item) ? (
                          <img
                            src={getProductImage(item)}
                            alt={item.name || "Product image"}
                            className={`w-16 h-16 object-contain rounded ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} />
                        )}
                        <div>
                          <p className={`font-medium line-clamp-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            {item.name}
                            {isUnavailable && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">Unavailable</span>}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Stock: {item.stock || 0} | Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <div className={`col-span-2 text-center font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        ₱{item.price.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-center">
                        <button
                          className={`font-medium text-sm ${isDarkMode ? 'text-red-400 hover:text-red-600' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => removeItem(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div>
              <div className={`rounded-lg shadow-sm p-6 sticky top-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span>Items ({Array.from(selectedItems).length})</span>
                    <span>₱{Array.from(selectedItems).reduce((sum, idx) => sum + cart[idx].price * cart[idx].qty, 0).toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center mb-6 pb-6 border-b text-lg font-bold ${isDarkMode ? 'border-gray-700' : ''}`}>
                  <span>Total:</span>
                  <span className={isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'}>₱{Array.from(selectedItems).reduce((sum, idx) => sum + cart[idx].price * cart[idx].qty, 0).toFixed(2)}</span>
                </div>
                <button
                  className={`w-full py-3 rounded font-semibold transition-colors ${
                    selectedItems.size === 0
                      ? isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60' : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                      : isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'
                  }`}
                  onClick={() => {
                    const selectedCart = Array.from(selectedItems).map(idx => cart[idx]);
                    navigate("/checkout", { state: { selectedCart } });
                  }}
                  disabled={selectedItems.size === 0}
                >
                  Proceed to Checkout
                </button>
                {selectedItems.size === 0 && cart.length > 0 && (
                  <div className={`mt-3 p-3 border rounded text-sm text-center ${isDarkMode ? 'bg-yellow-900 border-yellow-700 text-yellow-300' : 'bg-yellow-100 border-yellow-400 text-yellow-700'}`}>
                    Please select items to checkout.
                  </div>
                )}
                {cart.some(item => !item.stock || item.stock <= 0) && (
                  <div className={`mt-3 p-3 border rounded text-sm text-center ${isDarkMode ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
                    Some items are unavailable. You can still checkout with available items.
                  </div>
                )}
                <button
                  className={`w-full mt-3 border py-2 rounded font-medium transition ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => navigate("/home")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
