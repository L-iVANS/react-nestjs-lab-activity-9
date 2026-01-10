import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import Toast from "../common/Toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createPaymentLink } from "../../services/paymentService";
import { createOrder, validateOrder } from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import { useTheme } from '../../context/ThemeContext';

const CheckoutPage = () => {
    const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderRestored, setOrderRestored] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    const loadCheckoutCart = async () => {
      // Support direct checkout from ProductDetail via location.state
      const stateProduct = location.state?.product;
      const selectedCart = location.state?.selectedCart;
      
      if (stateProduct) {
        setCart([{ ...stateProduct }]);
        setTotal(stateProduct.price * (stateProduct.qty || 1));
      } else if (selectedCart && selectedCart.length > 0) {
        // Use selected items from cart - they already have stock from CartPage
        setCart(selectedCart);
        setTotal(selectedCart.reduce((sum, item) => sum + item.price * item.qty, 0));
      } else {
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
        
        const normalizedCart = cartItems.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }));
        setCart(normalizedCart);
        setTotal(normalizedCart.reduce((sum, item) => sum + item.price * item.qty, 0));
      }
    };

    loadCheckoutCart();
  }, [token, location.state]);

  // Handle PayMongo redirect results using query params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const orderIdParam = params.get("orderId");
    if (!status || !orderIdParam || !token) return;

    const updateOrderStatus = async () => {
      try {
        // This would need a backend endpoint to update order status
        // For now, we'll just redirect to orders page
        if (status === "success") {
          setToast({ message: "Payment successful!", type: "success" });
        } else if (status === "failed") {
          setToast({ message: "Payment failed or was cancelled", type: "error" });
        }
        
        // Redirect to orders page
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } catch (error) {
        console.error('Failed to update order status:', error);
        navigate("/orders");
      }
    };

    updateOrderStatus();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setToast({ message: "Please enter your full name", type: "error" });
      return false;
    }
    if (!formData.email.trim()) {
      setToast({ message: "Please enter your email", type: "error" });
      return false;
    }
    if (!formData.phone.trim()) {
      setToast({ message: "Please enter your phone number", type: "error" });
      return false;
    }
    if (!formData.address.trim()) {
      setToast({ message: "Please enter your address", type: "error" });
      return false;
    }
    if (!formData.city.trim()) {
      setToast({ message: "Please enter your city", type: "error" });
      return false;
    }
    if (!formData.zipCode.trim()) {
      setToast({ message: "Please enter your zip code", type: "error" });
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentData.paymentMethod === "credit-card" || paymentData.paymentMethod === "debit-card") {
      if (!paymentData.cardNumber.trim() || paymentData.cardNumber.length < 13) {
        setToast({ message: "Please enter a valid card number", type: "error" });
        return false;
      }
      if (!paymentData.cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(paymentData.cardExpiry)) {
        setToast({ message: "Please enter expiry date (MM/YY)", type: "error" });
        return false;
      }
      if (!paymentData.cardCVV.trim() || paymentData.cardCVV.length < 3) {
        setToast({ message: "Please enter a valid CVV", type: "error" });
        return false;
      }
      if (!paymentData.cardName.trim()) {
        setToast({ message: "Please enter cardholder name", type: "error" });
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (!validatePayment()) return;
    if (!cart.length) {
      setToast({ message: "Your cart is empty", type: "error" });
      return;
    }

    if (!user || !token) {
      setToast({ message: "Please login to place an order", type: "error" });
      console.error("Missing user or token:", { user: !!user, token: !!token });
      return;
    }

    console.log("Token being sent:", token ? token.substring(0, 20) + "..." : "null");
    setIsProcessing(true);

    try {
      // Validate order on backend
      const items = cart.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty
      }));

      const validationResult = await validateOrder(items);
      if (!validationResult.valid) {
        const errors = validationResult.errors?.errors || ["Order validation failed"];
        setToast({ message: errors.join("; "), type: "error" });
        setIsProcessing(false);
        return;
      }

      // Create order on backend
      const orderResult = await createOrder(
        token,
        items,
        formData,
        total,
        paymentData.paymentMethod
      );

      // Clear cart from localStorage
      localStorage.removeItem("cart");

      setToast({ message: "Order created successfully!", type: "success" });
      setCart(orderResult.items || []);
      setTotal(orderResult.total || 0);
      setOrderId(orderResult.id);
      setOrderPlaced(true);

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        if (user && user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 2000);

    } catch (error) {
      setToast({ message: error.message || "Failed to place order", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
          <div className={`rounded-lg shadow-lg p-8 max-w-md w-full text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Order Confirmed!</h1>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{orderRestored ? "Payment status updated" : "Thank you for your purchase"}</p>
            </div>
            <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order ID</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'}`}>{orderId}</p>
            </div>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <span>Items ({cart.length})</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className={`flex justify-between font-bold text-lg ${isDarkMode ? 'text-gray-100' : ''}`}>
                <span>Total</span>
                <span className={isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'}>₱{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className={`w-full py-3 rounded font-semibold transition-colors mb-3 ${isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'}`}
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
            <button
              className={`w-full border py-2 rounded font-medium transition ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => navigate("/orders")}
            >
              View Order History
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <Header />
      <div className={`min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200'}`}>
        <div className={`max-w-6xl mx-auto px-4 py-8 rounded-3xl shadow-xl ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'}`}>
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Checkout</h1>
          <div className="grid grid-cols-3 gap-8">
            {/* Shipping & Billing Form */}
            <div className="col-span-2">
              <div className={`rounded-lg shadow-sm p-6 mb-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}> 
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`col-span-2 border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                  </div>
                  <textarea
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    />
                  </div>
                </div>
              </div>
              {/* Payment Information */}
              <div className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}> 
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={paymentData.paymentMethod}
                      onChange={handlePaymentChange}
                      className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                    >
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="gcash">GCash</option>
                    </select>
                  </div>
                  {(paymentData.paymentMethod === "credit-card" || paymentData.paymentMethod === "debit-card") && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Full Name on Card"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={e => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                          maxLength="19"
                          className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                        />
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Test: 4343434343434345 (Visa) or 5555555555554444 (Mastercard)</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            placeholder="12/25"
                            value={paymentData.cardExpiry}
                            onChange={e => setPaymentData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                            maxLength="5"
                            className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>CVV</label>
                          <input
                            type="text"
                            name="cardCVV"
                            placeholder="123"
                            value={paymentData.cardCVV}
                            onChange={e => setPaymentData(prev => ({ ...prev, cardCVV: e.target.value.replace(/\D/g, '') }))}
                            maxLength="4"
                            className={`w-full border rounded px-4 py-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-900 ${isDarkMode ? 'border-gray-700' : 'border-[#7c3aed]'}`}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {paymentData.paymentMethod === "gcash" && (
                    <div className={`border rounded p-4 ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                        <strong>GCash Payment:</strong> You'll be redirected to GCash to complete the payment after placing the order.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div>
              <div className={`rounded-lg shadow-sm p-6 sticky top-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Order Summary</h2>
                {/* Cart Items */}
                <div className="mb-6 pb-6 border-b max-h-64 overflow-y-auto scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-start mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0 ${isDarkMode ? 'border-gray-700' : ''}`}>
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.qty}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stock: {item.stock !== undefined ? item.stock : 'N/A'}</p>
                      </div>
                      <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>₱{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span>Subtotal</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span>Tax</span>
                    <span>₱0.00</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center mb-6 pb-6 border-b text-lg font-bold ${isDarkMode ? 'border-gray-700' : ''}`}>
                  <span>Total:</span>
                  <span className={isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'}>₱{total.toFixed(2)}</span>
                </div>
                <button
                  className={`w-full py-3 rounded font-semibold transition-colors mb-3 ${isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'}`}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
                <button
                  className={`w-full border py-2 rounded font-medium transition ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
