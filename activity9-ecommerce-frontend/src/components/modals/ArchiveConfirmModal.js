import React from "react";

const ArchiveConfirmModal = ({ open, productName, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-200 bg-opacity-95">
      <div className="bg-white/90 shadow-xl p-8 w-full max-w-sm transition-all duration-300" style={{ borderRadius: '0 0 1rem 0' }}>
        <h3 className="text-xl font-bold mb-4 text-center text-[#7c3aed]">Archive Product</h3>
        <p className="mb-6 text-center text-gray-700">Are you sure you want to archive <span className="font-bold">{productName}</span>?</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 shadow transition-all duration-200">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 shadow transition-all duration-200">Archive</button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmModal;
