import api from "./axios";

/* ================= USER ORDERS ================= */
export const getMyOrders = () => {
  return api.get("/orders/my");
};