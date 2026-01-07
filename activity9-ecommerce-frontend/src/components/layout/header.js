import React, { useState } from "react";
import Toast from "../common/Toast";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/search.svg";
import cartIcon from "../../assets/icons/Cart.png";

const Header = ({ isGuest = false, isAdmin = false, onHome }) => {
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");

    React.useEffect(() => {
      if (window.setProducts) {
        if (!search) {
          // Restore full product list from localStorage
          const stored = localStorage.getItem('products');
          const allProducts = stored ? JSON.parse(stored) : [];
          window.setProducts(allProducts);
        } else {
          window.setProducts(prev =>
            prev.filter(p =>
              p.name && p.name.toLowerCase().includes(search.toLowerCase())
            )
          );
        }
      }
    }, [search]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };
  const confirmLogout = () => {
    setShowModal(false);
    navigate("/");
  };
  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="w-full border-b bg-gradient-to-r from-indigo-100 via-white to-indigo-200 px-8 md:px-16 lg:px-32 py-4 flex items-center justify-between shadow-lg" style={{ boxShadow: '0 6px 32px 0 rgba(124,60,237,0.10)' }}>
        <div
          className="text-5xl font-londrina font-bold text-[#7c3aed] p-5 cursor-pointer select-none drop-shadow-lg rounded-full bg-white/70 hover:bg-indigo-50 transition-all duration-200"
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
            if (window.setProducts) {
              window.setProducts(prev => prev.filter(p =>
                p.name && p.name.toLowerCase().includes(search.toLowerCase())
              ));
            }
            setToast({ message: `Showing results for "${search}"`, type: "info" });
          }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for a Product"
              className="flex-1 border border-indigo-200 bg-indigo-50 rounded-full px-6 py-3 pr-14 shadow-inner focus:border-indigo-300 focus:bg-white transition-all duration-200"
              style={{ fontSize: "1.08rem", boxShadow: '0 2px 12px 0 rgba(124,60,237,0.06) inset' }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-200 hover:bg-indigo-300 shadow-md transition-all duration-200"
              style={{ boxShadow: '0 2px 8px 0 rgba(124,60,237,0.10)' }}
            >
              <img src={searchIcon} alt="Search" className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Logout or Login */}
        <div className="flex items-center gap-3 ml-20">
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
          <div className="bg-white rounded-lg shadow-lg p-8 w-80 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-center text-[#7c3aed]">
              Confirm Logout
            </h3>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-[#7c3aed] text-white font-semibold hover:bg-[#5b23c3] transition-colors duration-200"
                onClick={() => {
                  setShowModal(false);
                  navigate("/guest");
                }}
              >
                Yes, Logout
              </button>
              <button
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
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
