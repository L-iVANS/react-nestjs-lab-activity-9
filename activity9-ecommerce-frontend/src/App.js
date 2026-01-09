import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Login from './components/auth/login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/forgotPassword';
import Home from './components/pages/Home';
import AdminHome from './components/pages/AdminHome';
import GuestHome from './components/pages/GuestHome';
import ProductDetailPage from './components/pages/ProductDetailPage';
import CartPage from './components/pages/CartPage';
import OrdersHistoryPage from './components/pages/OrdersHistoryPage';
import CheckoutPage from './components/pages/CheckoutPage';

function App() {
  // Do not clear local storage - we need to preserve auth token

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GuestHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route path="/guest" element={<GuestHome />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product-detail" 
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersHistoryPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;