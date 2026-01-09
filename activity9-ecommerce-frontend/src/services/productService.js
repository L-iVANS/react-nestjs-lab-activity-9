const API_URL = 'http://localhost:3000';

export const getAllProducts = async (token) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

export const getProductById = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
};

export const createProduct = async (productData, token) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }

  return response.json();
};

export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update product');
  }

  return response.json();
};

export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return response.json();
};

export const getProductsByCategory = async (category, token) => {
  const response = await fetch(`${API_URL}/products/category/${category}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }

  return response.json();
};

export const getArchivedProducts = async (token) => {
  const response = await fetch(`${API_URL}/products/archive/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch archived products');
  }

  return response.json();
};

export const archiveProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}/archive`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to archive product');
  }

  return response.json();
};

export const restoreProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}/restore`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to restore product');
  }

  return response.json();
};

