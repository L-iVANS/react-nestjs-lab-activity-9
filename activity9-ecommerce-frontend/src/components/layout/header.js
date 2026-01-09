import React, { useState } from "react";
import Toast from "../common/Toast";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/search.svg";
import cartIcon from "../../assets/icons/Cart.png";
import { useAuth } from "../../context/AuthContext";
import DarkModeToggle from "../common/DarkModeToggle";
import { useTheme } from "../../context/ThemeContext";

const Header = ({ isGuest = false, isAdmin = false, onHome, onSearch }) => {
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const { logout } = useAuth();
    const { isDarkMode } = useTheme();

    React.useEffect(() => {
      if (onSearch) {
        onSearch(search);
      }
    }, [search, onSearch]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };
  const confirmLogout = () => {
    setShowModal(false);
    logout();
    navigate("/", { replace: true });
  };
  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className={`w-full border-b px-8 md:px-16 lg:px-32 py-4 flex items-center justify-between shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-indigo-100 via-white to-indigo-200 border-indigo-100'
      }`} style={{ boxShadow: '0 6px 32px 0 rgba(124,60,237,0.10)' }}>
        <div
          className={`text-5xl font-londrina font-bold p-5 cursor-pointer select-none drop-shadow-lg rounded-full transition-all duration-200 ${
            isDarkMode 
              ? 'text-indigo-400 bg-gray-800 hover:bg-gray-700' 
              : 'text-[#7c3aed] bg-white/70 hover:bg-indigo-50'
          }`}
          onClick={() => {
            if (isAdmin) {
              if (onHome) onHome();
              navigate("/admin");
            } else if (isGuest) {
              if (onHome) onHome();
              navigate("/guest");
            } else {
              if (onHome) onHome();
              navigate("/home");
            }
          }}
        >
          TechStock
        </div>

        {/* Search/Filter Area + Cart Icon */}
        <div className="flex-1 flex items-center mr-12 ml-10 relative">
          <form className="flex-1 flex relative" onSubmit={e => {
            e.preventDefault();
          }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for a Product"
              className={`flex-1 rounded-full px-6 py-3 pr-14 shadow-inner transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'border border-indigo-200 bg-indigo-50 focus:border-indigo-300 focus:bg-white'
              }`}
              style={{ fontSize: "1.08rem", boxShadow: '0 2px 12px 0 rgba(124,60,237,0.06) inset' }}
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-200 hover:bg-indigo-300'
              }`}
              style={{ boxShadow: '0 2px 8px 0 rgba(124,60,237,0.10)' }}
            >
              <img src={searchIcon} alt="Search" className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Logout or Login */}
        <div className="flex items-center gap-3 ml-20">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          
          {isAdmin && (
            <button
              className="bg-[#7c3aed] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#a78bfa] hover:text-[#7c3aed] shadow-md transition-all duration-200 mr-2 scale-100 hover:scale-105"
              onClick={() => {
                if (onHome) onHome();
                navigate("/admin");
              }}
            >
              Home
            </button>
          )}
          {!isAdmin && !isGuest && (
            <button
              className="bg-[#7c3aed] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#a78bfa] hover:text-[#7c3aed] shadow-md transition-all duration-200 mr-2 scale-100 hover:scale-105"
              onClick={() => {
                if (onHome) onHome();
                navigate("/home");
              }}
            >
              Home
            </button>
          )}
          {isGuest && (
            <button
              className="bg-[#7c3aed] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#a78bfa] hover:text-[#7c3aed] shadow-md transition-all duration-200 mr-2 scale-100 hover:scale-105"
              onClick={() => {
                if (onHome) onHome();
                navigate("/guest");
              }}
            >
              Home
            </button>
          )}
          {isGuest ? (
            <button
              className="bg-[#7c3aed] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#a78bfa] hover:text-[#7c3aed] shadow-md transition-all duration-200 scale-100 hover:scale-105"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="bg-white px-5 py-2 rounded-full flex items-center gap-2 border-2 border-[#7c3aed] text-[#7c3aed] font-semibold hover:bg-[#ede9fe] hover:text-[#5b23c3] hover:border-[#5b23c3] shadow-md transition-all duration-200 mr-2 scale-100 hover:scale-105"
              style={{ minWidth: 'unset', fontSize: '1rem', padding: '8px 20px', justifyContent: 'center', height: '40px' }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {!isGuest && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`rounded-lg shadow-lg p-8 w-80 animate-fadeIn transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 text-center ${
              isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'
            }`}>
              Confirm Logout
            </h3>
            <p className={`mb-6 text-center ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-[#7c3aed] text-white font-semibold hover:bg-[#5b23c3] transition-colors duration-200"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className={`px-4 py-2 rounded border font-semibold transition-colors duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
