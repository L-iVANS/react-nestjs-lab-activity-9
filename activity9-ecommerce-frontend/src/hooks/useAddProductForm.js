import { useState, useMemo } from "react";

export default function useAddProductForm() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: 1,
    category: '',
    product: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isFormDirty = useMemo(() => {
    return (
      newProduct.name ||
      newProduct.price ||
      (newProduct.quantity && newProduct.quantity !== 1) ||
      newProduct.category ||
      newProduct.product ||
      (Array.isArray(newProduct.images) && newProduct.images.length > 0)
    );
  }, [newProduct]);

  const resetForm = () => {
    setNewProduct({
      name: '',
      price: '',
      quantity: 1,
      category: '',
      product: '',
      images: []
    });
    setImagePreviews([]);
    setErrors({});
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    if (isFormDirty && !success) {
      setShowConfirm(true);
    } else {
      setShowModal(false);
    }
  };

  const confirmClose = () => {
    setShowConfirm(false);
    setShowModal(false);
  };

  const cancelClose = () => {
    setShowConfirm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' && files && files.length > 0) {
      const fileArr = Array.from(files);
      const validFiles = fileArr.filter(f => f.type.startsWith('image/') && f.size <= 2 * 1024 * 1024);
      
      if (validFiles.length !== fileArr.length) {
        setErrors((prev) => ({ ...prev, images: 'Only image files up to 2MB are allowed.' }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, images: undefined }));
      }

      const newPreviews = [];
      let filesProcessed = 0;

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews.push(event.target.result);
          filesProcessed++;

          if (filesProcessed === validFiles.length) {
            setNewProduct((prev) => {
              const existing = prev.images || [];
              const newFiles = validFiles.filter(f => !existing.some(ex => ex === f));
              return { ...prev, images: [...existing, ...newFiles] };
            });
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (name === 'category') {
      setNewProduct((prev) => ({ ...prev, category: value, product: '' }));
    } else if (name === 'price') {
      setNewProduct((prev) => ({ ...prev, price: value.replace(/[^\d.]/g, '') }));
    } else if (name === 'quantity') {
      setNewProduct((prev) => ({ ...prev, quantity: Math.max(1, Number(value)) }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const removeImage = (idx) => {
    setNewProduct((prev) => ({
      ...prev,
      images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== idx) : []
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = 'Product name is required.';
    if (!newProduct.price.trim()) newErrors.price = 'Price is required.';
    else if (isNaN(Number(newProduct.price)) || Number(newProduct.price) < 0)
      newErrors.price = 'Price must be a non-negative number.';
    if (!newProduct.category) newErrors.category = 'Category is required.';
    if (!newProduct.product) newErrors.product = 'Product is required.';
    if (!newProduct.quantity || Number(newProduct.quantity) < 1)
      newErrors.quantity = 'Quantity must be at least 1.';
    if (newProduct.images.length === 0) newErrors.images = 'At least one image is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    showModal,
    setShowModal,
    showConfirm,
    newProduct,
    imagePreviews,
    errors,
    loading,
    setLoading,
    success,
    setSuccess,
    isFormDirty,
    openModal,
    closeModal,
    confirmClose,
    cancelClose,
    handleInputChange,
    removeImage,
    validateForm,
    resetForm,
  };
}
