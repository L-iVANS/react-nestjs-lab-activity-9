import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import Toast from "../common/Toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    // Support direct checkout from ProductDetail via location.state
    const location = window.location;
    let stateProduct = null;
    if (window.history && window.history.state && window.history.state.usr && window.history.state.usr.product) {
      stateProduct = window.history.state.usr.product;
    }
    if (stateProduct) {
      setCart([{ ...stateProduct }]);
      setTotal(stateProduct.price * (stateProduct.qty || 1));
    } else {
      const stored = localStorage.getItem("cart");
      const cartItems = stored ? JSON.parse(stored) : [];
      const normalizedCart = cartItems.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
      }));
      setCart(normalizedCart);
      setTotal(normalizedCart.reduce((sum, item) => sum + item.price * item.qty, 0));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      items: cart,
      shippingInfo: formData,
      total: total,
      status: "Confirmed"
    };

    // Save order to localStorage
    const existingOrders = localStorage.getItem("orders");
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem("cart");

    setOrderId(order.id);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-4">Thank you for your purchase</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-lg font-bold text-[#7c3aed]">{orderId}</p>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between text-gray-700">
                <span>Items ({cart.length})</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#7c3aed]">₱{total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
            </p>

            <button
              className="w-full bg-[#7c3aed] text-white py-3 rounded font-semibold hover:bg-[#5b23c3] transition-colors mb-3"
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>

            <button
              className="w-full border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-50"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-8 bg-white/80 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

          <div className="grid grid-cols-3 gap-8">
            {/* Shipping & Billing Form */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Shipping Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="col-span-2 border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>

                  <textarea
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="border rounded px-4 py-2 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>

                {/* Cart Items */}
                <div className="mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        <p className="text-sm text-gray-500">Stock: {item.stock !== undefined ? item.stock : 'N/A'}</p>
                      </div>
                      <p className="font-medium text-gray-800">₱{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>₱0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#7c3aed]">₱{total.toFixed(2)}</span>
                </div>

                <button
                  className="w-full bg-[#7c3aed] text-white py-3 rounded font-semibold hover:bg-[#5b23c3] transition-colors mb-3"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>

                <button
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-50"
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
