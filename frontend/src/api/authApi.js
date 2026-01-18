import api from "./axios";

/* ================= AUTH APIs ================= */

// User login
export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

// User registration
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// Get logged-in user profile
export const getProfile = () => {
  return api.get("/auth/me");
};

// Logout (frontend only)
export const logoutUser = () => {
  localStorage.removeItem("token");
};