import React from "react";

const ArchiveConfirmModal = ({ open, productName, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Archive Product</h3>
        <p className="mb-4">Are you sure you want to archive <span className="font-bold">{productName}</span>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Archive</button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmModal;
