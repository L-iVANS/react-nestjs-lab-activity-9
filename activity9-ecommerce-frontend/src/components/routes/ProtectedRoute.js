import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">
          Access Denied. You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
