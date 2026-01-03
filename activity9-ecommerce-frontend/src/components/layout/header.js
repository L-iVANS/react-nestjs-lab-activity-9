import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/search.svg";
import cartIcon from "../../assets/icons/Cart.png";

const Header = () => {
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
      <div className="w-full border-b bg-white px-8 md:px-16 lg:px-32 py-3 flex items-center justify-between">
        {/* Ecommerce Name */}
        <div className="text-5xl font-londrina font-bold text-[#8e4dffff] p-5">
          TechStock
        </div>

        {/* Search Area */}
        <form className="flex-1 flex mr-12 ml-10 relative">
          <input
            type="text"
            placeholder="Search for a Product"
            className="flex-1 border rounded-xl px-4 py-2 pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
            onClick={() => alert('Search icon clicked!')}
          >
            <img src={searchIcon} alt="Search" className="w-6 h-6" />
          </button>
        </form>

        {/*Cart and Logout*/}
        <div className="flex items-center gap-2 ml-20">
          <button className="bg-[#7c3aed] text-[#ffffff] px-4 py-2 rounded flex items-center gap-2" disabled>
            Your Cart
            <img src={cartIcon} alt="Cart" className="w-5 h-5" />
          </button>
          <button
            className="text-[#000000] px-4 py-2 rounded border-2 border-transparent hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-80 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-center text-[#7c3aed]">Confirm Logout</h3>
            <p className="mb-6 text-center text-gray-700">Are you sure you want to logout?</p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-[#7c3aed] text-white font-semibold hover:bg-[#5b23c3] transition-colors duration-200"
                onClick={confirmLogout}
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