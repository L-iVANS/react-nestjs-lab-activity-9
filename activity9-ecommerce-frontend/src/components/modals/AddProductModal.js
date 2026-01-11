import React from "react";
import { useTheme } from "../../context/ThemeContext";

const categories = [
  { name: "Components", products: ["Graphics Card", "Memory", "Hard Disk", "Mother Board", "Power Supply"] },
  { name: "Peripherals", products: ["Mouse", "Keyboard", "Monitor"] },
  { name: "Accessories", products: ["Headphones", "Chargers"] },
  { name: "Laptops", products: ["Chromebook", "Gaming Laptop"] },
  { name: "Desktops", products: ["AMD Base", "Intel Base"] },
  { name: "Mobile Devices", products: ["Android", "iOS"] },
];

const AddProductModal = ({
  show,
  onClose,
  onAdd,
  loading,
  success,
  newProduct,
  setNewProduct,
  imagePreviews,
  setImagePreviews,
  errors,
  handleInputChange,
  removeImage,
}) => {
  const { isDarkMode } = useTheme();
  const [showConfirm, setShowConfirm] = React.useState(false);
  
  // Check if there's any unsaved data
  const hasUnsavedData = () => {
    return (
      newProduct?.name?.trim() ||
      newProduct?.description?.trim() ||
      newProduct?.price ||
      newProduct?.category ||
      newProduct?.product ||
      newProduct?.quantity ||
      (imagePreviews && imagePreviews.length > 0)
    );
  };

  const handleCloseClick = () => {
    if (hasUnsavedData()) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    setTimeout(() => {
      onClose();
    }, 100);
  };
  
  if (!show) return null;

  return (
    <>
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} style={{ width: '350px' }}>
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Discard Changes?</h3>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>You have unsaved changes. Are you sure you want to close?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal with backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className={`shadow-2xl p-8 relative rounded-3xl border-2 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
            : 'bg-gradient-to-br from-white via-indigo-50 to-white border-indigo-200'
        }`} style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
          <button
            className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all text-2xl font-bold ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
            }`}
            onClick={handleCloseClick}
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
          }`}>Add New Product</h3>
          <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Select Image</label>
              <label className={`w-full flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-indigo-500' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-gray-700 border-indigo-300 hover:border-indigo-400'
              }`}>
                <span className={`font-bold text-base ${
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
                }`}>Select Images</span>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              {errors?.images && (
                <div className="text-red-600 text-xs mb-1">{errors.images}</div>
              )}
              {imagePreviews && imagePreviews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative inline-block">
                      <img src={src} alt={`Preview ${idx+1}`} className={`w-20 h-20 object-contain rounded border ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`} />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-800"
                        style={{ transform: 'translate(40%,-40%)' }}
                        onClick={() => removeImage(idx)}
                        tabIndex={-1}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Category</label>
              <select
                name="category"
                value={newProduct?.category || ""}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 hover:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-300 hover:border-indigo-400'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors?.category && (
                <div className="text-red-600 text-xs mt-1">{errors.category}</div>
              )}
            </div>

            {/* Product */}
            {newProduct?.category && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Product</label>
                <select
                  name="product"
                  value={newProduct?.product || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600 hover:border-gray-500' 
                      : 'bg-white text-gray-900 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <option value="">Select product</option>
                  {categories.find(c => c.name === newProduct.category)?.products.map((prod) => (
                    <option key={prod} value={prod}>{prod}</option>
                  ))}
                </select>
                {errors?.product && (
                  <div className="text-red-600 text-xs mt-1">{errors.product}</div>
                )}
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Product Name</label>
              <input
                type="text"
                name="name"
                value={newProduct?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 hover:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 hover:border-indigo-400'
                }`}
              />
              {errors?.name && (
                <div className="text-red-600 text-xs mt-1">{errors.name}</div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Price</label>
              <input
                type="number"
                name="price"
                value={newProduct?.price || ""}
                onChange={handleInputChange}
                placeholder="Enter price"
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 hover:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 hover:border-indigo-400'
                }`}
              />
              {errors?.price && (
                <div className="text-red-600 text-xs mt-1">{errors.price}</div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newProduct?.quantity || 0}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="0"
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400 hover:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 hover:border-indigo-400'
                }`}
              />
              {errors?.quantity && (
                <div className="text-red-600 text-xs mt-1">{errors.quantity}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={handleCloseClick}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="md:col-span-2 p-2 bg-green-100 text-green-700 rounded text-center">
                Product added successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
