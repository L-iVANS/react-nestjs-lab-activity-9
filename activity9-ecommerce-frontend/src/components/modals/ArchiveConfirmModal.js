import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ArchiveConfirmModal = ({ open, productName, onConfirm, onCancel }) => {
  const { isDarkMode } = useTheme();
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black bg-opacity-70' 
        : 'bg-gradient-to-r from-indigo-100 via-white to-indigo-200 bg-opacity-95'
    }`}>
      <div className={`shadow-xl p-8 w-full max-w-sm transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white/90'
      }`} style={{ borderRadius: '0 0 1rem 0' }}>
        <h3 className={`text-xl font-bold mb-4 text-center ${
          isDarkMode ? 'text-indigo-400' : 'text-[#7c3aed]'
        }`}>Archive Product</h3>
        <p className={`mb-6 text-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Are you sure you want to archive <span className="font-bold">{productName}</span>?</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={onCancel} className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 shadow transition-all duration-200">Archive</button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmModal;
