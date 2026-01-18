import api from "./axios";

/* ================= ADMIN PRODUCTS API ================= */

/**
 * GET all products (Admin)
 * Supports: search, category, sort, page, limit
 */
export const fetchAdminProducts = async (params = {}) => {
  const { data } = await api.get("/admin/products", { params });
  return data;
};

/**
 * CREATE product (Admin only)
 */
export const createAdminProduct = async (product) => {
  const { data } = await api.post("/admin/products", product);
  return data;
};

/**
 * UPDATE product (Admin only)
 */
export const updateAdminProduct = async (id, product) => {
  const { data } = await api.put(`/admin/products/${id}`, product);
  return data;
};

/**
 * DELETE product (Admin only)
 */
export const deleteAdminProduct = async (id) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};
/**
 * GET distinct product categories (Admin only)
 */
export const fetchAdminCategories = async () => {
  const { data } = await api.get("/admin/products/categories");
  return data;
};