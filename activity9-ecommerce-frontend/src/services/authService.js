const API_BASE_URL = "http://localhost:3000";

// Sign up a new user
export const signup = async (email, password, firstName, lastName, role = "guest") => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Verify token
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get current user");
    }

    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};
