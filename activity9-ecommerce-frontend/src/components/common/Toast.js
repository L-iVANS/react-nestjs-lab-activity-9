import React from "react";

const Toast = ({ message, type = "info", onClose }) => {
  // type: info, success, error, warning
  const colors = {
    info: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-300"
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-300"
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-300"
    }
  };
  const color = colors[type] || colors.info;

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-xl border ${color.bg} ${color.text} ${color.border} flex items-center gap-3 animate-fadeIn`}
      style={{ minWidth: "220px", fontWeight: "bold", fontSize: "1rem", boxShadow: "0 4px 24px 0 rgba(99,102,241,0.10)" }}>
      <span>{message}</span>
      <button
        className="ml-4 px-2 py-1 rounded-full bg-white/60 hover:bg-white text-gray-600 text-xs font-semibold border border-gray-300 shadow"
        onClick={onClose}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
