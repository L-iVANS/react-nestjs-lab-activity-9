import React from "react";
import Header from "../layout/header";
import SideNav from "../layout/sideNav";
import Pagination from "../layout/Pagination";
import AddProductModal from "../product/AddProductModal";
import ProductGrid from "../product/ProductGrid";
import ArrowDown from "../../assets/icons/arrowDown.png";
import useProducts from "../../hooks/useProducts";
import useProductFilter from "../../hooks/useProductFilter";
import filterByPrice from "../../utils/filterByPrice";
import useAddProductForm from "../../hooks/useAddProductForm";
import useArchiveConfirm from "../../hooks/useArchiveConfirm";
import ArchiveConfirmModal from "../modals/ArchiveConfirmModal";
import ArchivedProducts from "../archive/ArchivedProducts";

const categories = [
  { name: "Components", products: ["Graphics Card", "Memory", "Hard Disk", "Mother Board", "Power Supply"] },
  { name: "Peripherals", products: ["Mouse", "Keyboard", "Monitor"] },
  { name: "Accessories", products: ["Headphones", "Chargers"] },
  { name: "Laptops", products: ["Chromebook", "Gaming Laptop"] },
  { name: "Desktops", products: ["AMD Base", "Intel Base"] },
  { name: "Mobile Devices", products: ["Android", "iOS"] },
];

const AdminHome = () => {
  const [isPriceAsc, setIsPriceAsc] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [showArchive, setShowArchive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;

  // Use custom hooks for business logic
  const { products, setProducts, archivedProducts, setArchivedProducts, addProduct, archiveProduct, restoreProduct } = useProducts();
  const formState = useAddProductForm();
  const { archiveConfirm, openArchiveConfirm, confirmArchive, cancelArchive, setArchiveConfirm } = useArchiveConfirm();


  // Filter and sort products by price
  const { filteredProducts } = useProductFilter(products, selectedCategory, selectedProduct, currentPage, productsPerPage);
  const sortedProducts = filterByPrice(filteredProducts, isPriceAsc);
  const paginatedProducts = sortedProducts.slice(
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

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formState.validateForm()) return;

    formState.setLoading(true);
    setTimeout(() => {
      const productToAdd = { ...formState.newProduct, images: formState.imagePreviews };
      addProduct(productToAdd);
      formState.setLoading(false);
      formState.setSuccess(true);
      setTimeout(() => {
        formState.setShowModal(false);
        formState.setSuccess(false);
        formState.resetForm();
      }, 1200);
    }, 1000);
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
    const updatedArchived = archivedProducts.filter((_, i) => i !== idx);
    setArchivedProducts(updatedArchived);
    localStorage.setItem('archivedProducts', JSON.stringify(updatedArchived));
  };

  const handleHome = () => {
    setSelectedCategory("");
    setSelectedProduct("");
    setShowArchive(false);
  };

  return (
    <>
      <Header isAdmin={true} onHome={handleHome} />
      <div className="flex">
        <SideNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onArchiveClick={() => setShowArchive(true)}
          isAdmin={true}
        />
        <div className="flex-1 min-h-0 flex flex-col relative" style={{height: '100vh'}}>
          {!showArchive ? (
            <>
              <div className="flex items-center justify-between m-6">
                <div className="text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit" onClick={handleToggle}>
                  Filter by Price
                  <img
                    src={ArrowDown}
                    alt="Toggle Arrow"
                    className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
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
