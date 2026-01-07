import React from "react";

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
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-200 bg-opacity-95">
        <div className="bg-white/90 shadow-xl p-8 relative" style={{ borderRadius: '0 0 1rem 0', width: '600px', maxWidth: '95vw' }}>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--accent-color)' }}>Add New Product</h3>
          <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Select Image</label>
              <label className="w-full flex items-center justify-center px-3 py-2 border rounded-md cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--bg-main)] text-[var(--text-primary)]" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-semibold" style={{ color: 'var(--accent-color)' }}>Select Image</span>
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
                      <img src={src} alt={`Preview ${idx+1}`} className="w-20 h-20 object-contain rounded border" style={{ borderColor: 'var(--border-color)' }} />
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
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={newProduct?.category || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
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
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  name="product"
                  value={newProduct?.product || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
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
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={newProduct?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
              />
              {errors?.name && (
                <div className="text-red-600 text-xs mt-1">{errors.name}</div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={newProduct?.price || ""}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
              />
              {errors?.price && (
                <div className="text-red-600 text-xs mt-1">{errors.price}</div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={newProduct?.quantity || 1}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="1"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
              />
              {errors?.quantity && (
                <div className="text-red-600 text-xs mt-1">{errors.quantity}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
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
