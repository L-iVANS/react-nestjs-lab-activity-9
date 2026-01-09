import React, { createContext, useState, useContext, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Failed to parse saved user:", err);
        }
      }
    }
    setLoading(false);
  }, []);

  // Signup function
  const signup = async (email, password, firstName, lastName, role = "guest") => {
    try {
      setError(null);
      const response = await authService.signup(email, password, firstName, lastName, role);
      
      // Store token
      localStorage.setItem("auth_token", response.token);
      setToken(response.token);
      
      // Store user info
      const userData = {
        id: response.id,
        email: response.email,
        role: response.role,
        firstName,
        lastName,
      };
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setUser(userData);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      
      // Store token
      localStorage.setItem("auth_token", response.token);
      setToken(response.token);
      
      // Store user info
      const userData = {
        id: response.id,
        email: response.email,
        role: response.role,
      };
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setUser(userData);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
