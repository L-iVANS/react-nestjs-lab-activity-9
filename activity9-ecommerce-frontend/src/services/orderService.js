const API_BASE_URL = "http://localhost:3000";

// Validate order before checkout
export const validateOrder = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Order validation error:", error);
    throw error;
  }
};

// Create order
export const createOrder = async (token, items, shippingInfo, total, paymentMethod) => {
  try {
    console.log("createOrder called with token:", token ? token.substring(0, 20) + "..." : "null");
    
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token provided to createOrder");
    }
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        items,
        shippingInfo,
        total,
        paymentMethod,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Order creation response error:", error);
      throw new Error(error.message || "Order creation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Order creation error:", error);
    throw error;
  }
};

// Get user's orders
export const getUserOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Get user orders error:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (token, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    return await response.json();
  } catch (error) {
    console.error("Get order error:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (token, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Order cancellation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Cancel order error:", error);
    throw error;
  }
};
