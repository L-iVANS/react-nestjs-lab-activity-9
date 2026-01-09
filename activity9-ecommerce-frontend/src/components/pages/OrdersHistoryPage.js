import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../services/orderService";
import { useTheme } from '../../context/ThemeContext';

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("You must be logged in to view orders");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserOrders(token);
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // When user presses the browser back button from Orders, send them to Home instead of Checkout
  useEffect(() => {
    const handleBackToHome = (event) => {
      event.preventDefault();
      navigate("/home", { replace: true });
    };

    window.addEventListener("popstate", handleBackToHome);
    return () => window.removeEventListener("popstate", handleBackToHome);
  }, [navigate]);

  return (
    <>
      <Header />
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Order History</h1>
          
          {loading ? (
            <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Loading orders...</p>
            </div>
          ) : error ? (
            <div className={`text-center py-16 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
              <p className="mb-4">{error}</p>
              <button
                className={`px-6 py-2 rounded font-semibold transition ${isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'}`}
                onClick={() => navigate("/home")}
              >
                Go Shopping
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="mb-4">You have no orders yet.</p>
              <button
                className={`px-6 py-2 rounded font-semibold transition ${isDarkMode ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-[#7c3aed] text-white hover:bg-[#5b23c3]'}`}
                onClick={() => navigate("/home")}
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold text-lg ${isDarkMode ? 'text-gray-100' : ''}`}>Order #{order.id}</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Date not available"}</span>
                  </div>
                  <div className={`mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status: <span className="font-medium">{order.status || "Pending"}</span></div>
                  <div className={`mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Payment Method: <span className="font-medium">
                      {order.paymentMethod ? (
                        order.paymentMethod === 'gcash' ? 'GCash' :
                        order.paymentMethod === 'credit-card' ? 'Credit Card' :
                        order.paymentMethod === 'debit-card' ? 'Debit Card' :
                        order.paymentMethod.replace('-', ' ').toUpperCase()
                      ) : "Not specified"}
                    </span></div>
                  <div className={`mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Total: <span className={`font-bold ${isDarkMode ? 'text-indigo-400' : ''}`}>₱{Number(order.total)?.toFixed(2) || "0.00"}</span></div>
                  <div className="mt-4">
                    <h2 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : ''}`}>Items:</h2>
                    <ul className="list-disc pl-6">
                      {(order.items || []).map((item, i) => (
                        <li key={i} className={`mb-1 ${isDarkMode ? 'text-gray-300' : ''}`}>
                          {item.name} x{item.qty} — ₱{Number(item.price)?.toFixed(2) || "0.00"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersHistoryPage;
