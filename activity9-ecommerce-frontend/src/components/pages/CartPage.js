import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    const cartItems = stored ? JSON.parse(stored) : [];
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
  }, []);

  const updateQty = (idx, delta) => {
    let lastCall = window.__cartQtyGuard || {};
    const now = Date.now();
    if (lastCall[idx] && now - lastCall[idx] < 300) {
      // Prevent double increment within 300ms
      return;
    }
    lastCall[idx] = now;
    window.__cartQtyGuard = lastCall;
    setCart((prev) => {
      const updated = [...prev];
      const oldQty = updated[idx].qty;
      updated[idx].qty = Math.max(1, oldQty + delta);
      console.log(`Cart item ${idx}: delta=${delta}, oldQty=${oldQty}, newQty=${updated[idx].qty}`);
      localStorage.setItem("cart", JSON.stringify(updated));
      setTotal(updated.reduce((sum, item) => sum + item.price * item.qty, 0));
      return updated;
    });
  };

  const removeItem = (idx) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
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
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            className="bg-[#7c3aed] text-white px-6 py-2 rounded hover:bg-[#5b23c3]"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-8 bg-white/80 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b font-semibold text-gray-700 bg-gray-50">
                  <div className="col-span-1">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Cart Items */}
                <div>
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 px-6 py-4 border-b items-center hover:bg-gray-50"
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedItems.has(idx)}
                          onChange={() => toggleSelectItem(idx)}
                        />
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        {getProductImage(item) ? (
                          <img
                            src={getProductImage(item)}
                            alt={item.name || "Product image"}
                            className="w-16 h-16 object-contain bg-white rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white rounded" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            SKU: {idx + 1}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center text-gray-700 font-medium">
                        ₱{item.price.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-1 border rounded w-fit mx-auto">
                          <button
                            className="px-2 py-1 hover:bg-gray-200"
                            onClick={() => updateQty(idx, -1)}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 min-w-[30px]">
                            {item.qty}
                          </span>
                          <button
                            className="px-2 py-1 hover:bg-gray-200"
                            onClick={() => updateQty(idx, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <button
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                          onClick={() => removeItem(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Items ({cart.length})</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#7c3aed]">₱{total.toFixed(2)}</span>
                </div>

                <button
                  className="w-full bg-[#7c3aed] text-white py-3 rounded font-semibold hover:bg-[#5b23c3] transition-colors"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-50"
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
