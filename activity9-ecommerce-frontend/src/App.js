import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/guest" element={<GuestHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;