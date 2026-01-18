import api from "./axios";

export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post("/cart/add", { productId, quantity });
  return data;
};

export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put("/cart/update", { productId, quantity });
  return data;
};

export const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return data;
};