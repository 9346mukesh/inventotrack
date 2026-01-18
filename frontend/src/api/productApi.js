import api from "./axios";

/**
 * Fetch all products with optional filters
 * @param {Object} params
 * @param {string} params.search
 * @param {string} params.category
 * @param {string} params.sort
 */

export const fetchProducts = async ({ search, category, sort } = {}) => {
  const { data } = await api.get("/products", {
    params: {
      search,
      category,
      sort
    }
  });
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

