import React from "react";
import { useAuth } from "../../context/AuthContext";
import { createProduct, updateProduct } from "../../services/productService";
import Header from "../layout/header";
import SideNav from "../layout/sideNav";
import Pagination from "../layout/Pagination";
import AddProductModal from "../modals/AddProductModal";
import ProductGrid from "../product/ProductGrid";
import ArrowDown from "../../assets/icons/arrowDown.png";
import useProducts from "../../hooks/useProducts";
import useProductFilter from "../../hooks/useProductFilter";
import filterByPrice from "../../utils/filterByPrice";
import useAddProductForm from "../../hooks/useAddProductForm";
import useArchiveConfirm from "../../hooks/useArchiveConfirm";
import ArchiveConfirmModal from "../modals/ArchiveConfirmModal";
import ArchivedProducts from "./ArchivedProducts";
import { useTheme } from "../../context/ThemeContext";

const categories = [
  { name: "Components", products: ["Graphics Card", "Memory", "Hard Disk", "Mother Board", "Power Supply"] },
  { name: "Peripherals", products: ["Mouse", "Keyboard", "Monitor"] },
  { name: "Accessories", products: ["Headphones", "Chargers"] },
  { name: "Laptops", products: ["Chromebook", "Gaming Laptop"] },
  { name: "Desktops", products: ["AMD Base", "Intel Base"] },
  { name: "Mobile Devices", products: ["Android", "iOS"] },
];

const AdminHome = () => {
  const { token, user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isPriceAsc, setIsPriceAsc] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [showArchive, setShowArchive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [toast, setToast] = React.useState(null);
  const productsPerPage = 8;

  // Debug: Check if token exists
  React.useEffect(() => {
    console.log('AdminHome - Token:', token ? 'exists' : 'missing');
    console.log('AdminHome - User:', user);
    if (!token) {
      console.error('No authentication token found!');
    }
  }, [token, user]);

  // Use custom hooks for business logic
  const { products, setProducts, archivedProducts, setArchivedProducts, addProduct, archiveProduct, restoreProduct, refreshProducts, loading } = useProducts(token);
  const formState = useAddProductForm();
  const { archiveConfirm, openArchiveConfirm, confirmArchive, cancelArchive, setArchiveConfirm } = useArchiveConfirm();


  // Filter and sort products by price
  const { filteredProducts } = useProductFilter(products, selectedCategory, selectedProduct, currentPage, productsPerPage);
  const sortedProducts = filterByPrice(filteredProducts, isPriceAsc);
  // Sort to put 0 quantity items at the end
  const productsWithAvailability = [...sortedProducts].sort((a, b) => {
    const aStock = a.stock || a.quantity || 0;
    const bStock = b.stock || b.quantity || 0;
    if (aStock === 0 && bStock === 0) return 0;
    if (aStock === 0) return 1;
    if (bStock === 0) return -1;
    return 0;
  });
  const paginatedProducts = productsWithAvailability.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Reset filters when navigating to /admin
  React.useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/admin") {
        setSelectedCategory("");
        setSelectedProduct("");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  React.useEffect(() => {
    if (window.location.pathname === "/admin") {
      setSelectedCategory("");
      setSelectedProduct("");
    }
  }, [window.location.pathname]);

  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formState.validateForm()) return;

    // Check for duplicate product name
    if (formState.checkDuplicateName(formState.newProduct.name)) {
      setToast({ message: "Product with this name already exists!", type: "error" });
      return;
    }

    formState.setLoading(true);
    try {
      const productData = {
        name: formState.newProduct.name,
        description: formState.newProduct.description || '',
        price: parseFloat(formState.newProduct.price),
        category: formState.newProduct.category,
        productType: formState.newProduct.product,
        stock: parseInt(formState.newProduct.quantity) || 0,
        images: formState.imagePreviews
      };

      const createdProduct = await createProduct(productData, token);
      
      // Add to local state
      addProduct(createdProduct);
      
      formState.setLoading(false);
      formState.setSuccess(true);
      setToast({ message: "Product added successfully!", type: "success" });
      setTimeout(() => {
        formState.setShowModal(false);
        formState.setSuccess(false);
        formState.resetForm();
      }, 1200);
    } catch (error) {
      formState.setLoading(false);
      setToast({ message: error.message || "Failed to add product", type: "error" });
    }
  };

  const handleRemoveProduct = (idx) => {
    const product = paginatedProducts[idx];
    openArchiveConfirm(idx, product?.name || "");
  };

  const handleConfirmArchive = () => {
    const idx = archiveConfirm.idx;
    const productToArchive = paginatedProducts[idx];
    if (!productToArchive) {
      confirmArchive();
      return;
    }
    archiveProduct(productToArchive);
    confirmArchive();
  };

  const handleRestoreProduct = (idx) => {
    const productToRestore = archivedProducts[idx];
    if (!productToRestore) return;
    restoreProduct(productToRestore);
  };

  const handleDeleteProduct = (idx) => {
    const productToDelete = archivedProducts[idx];
    if (!productToDelete) return;
    // Archive deletion is handled via the backend now
    // Just remove from local state
    const updatedArchived = archivedProducts.filter((_, i) => i !== idx);
    setArchivedProducts(updatedArchived);
  };

  const handleUpdateProduct = async (idx, updates) => {
    try {
      const product = paginatedProducts[idx];
      if (!product || !product.id) return;

      const updatedData = {
        name: updates.name,
        price: parseFloat(updates.price),
        stock: parseInt(updates.stock) || 0,
        productType: product.productType,
        description: product.description,
        category: product.category
      };

      const updatedProduct = await updateProduct(product.id, updatedData, token);
      
      // Refresh products from backend to get latest stock
      await refreshProducts();
      setToast({ message: "Product updated successfully!", type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Failed to update product", type: "error" });
    }
  };

  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setShowArchive(false);
  };

  return (
    <>
      <Header isAdmin={true} onHome={handleHome} />
      <div className={`flex min-h-screen rounded-3xl shadow-2xl p-4 md:p-8 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200'
      }`}>
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onArchiveClick={() => setShowArchive(true)}
          isAdmin={true}
        />
        <div className={`flex-1 min-h-0 flex flex-col relative rounded-3xl shadow-xl mx-2 md:mx-6 p-4 md:p-8 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/80'
         } overflow-y-auto scrollbar-hide`}>
          {!showArchive ? (
            <>
              <div className="flex items-center justify-between m-6">
                <div className={`text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit px-4 py-2 rounded-xl shadow-sm transition ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600 text-indigo-400 hover:bg-gray-600' 
                    : 'bg-indigo-50 border border-indigo-100 hover:bg-indigo-100'
                }`} onClick={handleToggle}>
                  Filter by Price
                  <img
                    src={ArrowDown}
                    alt="Toggle Arrow"
                    className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
                    style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
                  />
                </div>
                <button
                  onClick={() => formState.openModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add Product
                </button>
              </div>
              <ProductGrid
                products={paginatedProducts}
                onRemove={handleRemoveProduct}
                isAdmin={true}
                onUpdate={handleUpdateProduct}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col relative" style={{height: '100vh'}}>
              <ArchivedProducts
                archivedProducts={archivedProducts}
                onRestore={handleRestoreProduct}
              />
            </div>
          )}
        </div>
      </div>
      <AddProductModal
        show={formState.showModal}
        onClose={() => formState.closeModal()}
        onAdd={handleAddProduct}
        loading={formState.loading}
        success={formState.success}
        newProduct={formState.newProduct}
        setNewProduct={() => {}}
        imagePreviews={formState.imagePreviews}
        setImagePreviews={() => {}}
        errors={formState.errors}
        handleInputChange={formState.handleInputChange}
        removeImage={formState.removeImage}
      />
      <ArchiveConfirmModal
        open={archiveConfirm.open}
        productName={archiveConfirm.productName}
        onConfirm={handleConfirmArchive}
        onCancel={() => cancelArchive()}
      />
    </>
  );
};

export default AdminHome;
