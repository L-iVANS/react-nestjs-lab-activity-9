import { useState, useEffect } from "react";
import { getAllProducts, getArchivedProducts, archiveProduct, restoreProduct } from "../services/productService";

export default function useProducts(token) {
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        console.log('No token available, skipping product fetch');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching products with token:', token ? 'Token exists' : 'No token');
        
        // Fetch active products
        const data = await getAllProducts(token);
        console.log('Products fetched successfully:', data.length);
        console.log('Sample product with images:', data[0]);
        if (data[0]?.images) {
          console.log('Images type:', typeof data[0].images, 'Is array:', Array.isArray(data[0].images));
          console.log('First image preview:', data[0].images[0]?.substring(0, 50));
        }
        setProducts(data);

        // Fetch archived products
        try {
          const archived = await getArchivedProducts(token);
          setArchivedProducts(archived);
        } catch (error) {
          console.error('Failed to fetch archived products:', error);
          setArchivedProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // If unauthorized, might need to re-login
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.error('Unauthorized - token may be invalid or expired');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const addProduct = (product) => {
    const updated = [product, ...products];
    setProducts(updated);
  };

  const refreshProducts = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await getAllProducts(token);
      setProducts(data);
      console.log('Products refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh products:', error);
    } finally {
      setLoading(false);
    }
  };

  const archiveProductHandler = async (product) => {
    try {
      const archivedProduct = await archiveProduct(product.id, token);
      const updatedProducts = products.filter(p => p.id !== product.id);
      const updatedArchived = [archivedProduct, ...archivedProducts];
      setProducts(updatedProducts);
      setArchivedProducts(updatedArchived);
      console.log('Product archived successfully');
    } catch (error) {
      console.error('Failed to archive product:', error);
      throw error;
    }
  };

  const restoreProductHandler = async (product) => {
    try {
      const restoredProduct = await restoreProduct(product.id, token);
      const updatedArchived = archivedProducts.filter(p => p.id !== product.id);
      const updatedProducts = [restoredProduct, ...products];
      setArchivedProducts(updatedArchived);
      setProducts(updatedProducts);
      console.log('Product restored successfully');
    } catch (error) {
      console.error('Failed to restore product:', error);
      throw error;
    }
  };

  return {
    products,
    setProducts,
    archivedProducts,
    setArchivedProducts,
    addProduct,
    archiveProduct: archiveProductHandler,
    restoreProduct: restoreProductHandler,
    refreshProducts,
    loading,
  };
}
