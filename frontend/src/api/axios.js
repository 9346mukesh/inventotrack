import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api"; // Fallback for local dev

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // ⏱️ prevents hanging requests
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= GLOBAL ERROR HANDLER ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: central error logging
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token expired or invalid");
      // optional auto logout:
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;