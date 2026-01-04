import React from "react";
import Header from "../layout/header";
import SideNav from "../layout/sideNav";
import ProductCard from "../product/ProductCard";
import ArrowDown from "../../assets/icons/arrowDown.png";

const GuestHome = () => {
  const [isPriceAsc, setIsPriceAsc] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;
  const totalProducts = 32;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const products = Array.from({ length: totalProducts }, (_, idx) => ({
    name: "Product Name",
    price: "$ 000.000",
  }));
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const handleToggle = () => setIsPriceAsc((prev) => !prev);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <Header isGuest={true} />
      <div className="flex">
        <SideNav />
        <div className="flex-1 min-h-0 flex flex-col" style={{height: '100vh'}}>
          <div className="m-6 text-lg font-bold flex items-center gap-2 select-none cursor-pointer w-fit" onClick={handleToggle}>
            Filter by Price
            <img
              src={ArrowDown}
              alt="Toggle Arrow"
              className={`w-3 h-3 transition-transform duration-200 ${isPriceAsc ? '' : 'rotate-180'}`}
            />
          </div>
          <div className="flex-1 px-2 md:px-8 pb-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-7xl h-full flex items-center justify-center">
              <div className="grid grid-cols-4 grid-rows-2 gap-8 w-full h-full">
                {paginatedProducts.slice(0, 8).map((product, idx) => (
                  <ProductCard key={idx} name={product.name} price={product.price} isGuest={true} />
                ))}
              </div>
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 pb-8">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestHome;
