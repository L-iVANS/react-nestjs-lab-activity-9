import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import { useNavigate } from "react-router-dom";

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Example: fetch orders from localStorage or API
    const stored = localStorage.getItem("orders");
    const ordersList = stored ? JSON.parse(stored) : [];
    setOrders(ordersList);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Order History</h1>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="mb-4">You have no orders yet.</p>
              <button
                className="bg-[#7c3aed] text-white px-6 py-2 rounded hover:bg-[#5b23c3]"
                onClick={() => navigate("/home")}
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">Order #{order.id || idx + 1}</span>
                    <span className="text-sm text-gray-500">{order.date || "Date not available"}</span>
                  </div>
                  <div className="mb-2 text-gray-700">Status: <span className="font-medium">{order.status || "Completed"}</span></div>
                  <div className="mb-2 text-gray-700">Total: <span className="font-bold">₱{order.total?.toFixed(2) || "0.00"}</span></div>
                  <div className="mt-4">
                    <h2 className="font-semibold mb-2">Items:</h2>
                    <ul className="list-disc pl-6">
                      {(order.items || []).map((item, i) => (
                        <li key={i} className="mb-1">
                          {item.name} x{item.qty} — ₱{item.price?.toFixed(2) || item.price}
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
