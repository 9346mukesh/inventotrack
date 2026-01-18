import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  saveForLater,
  moveToCart
} from "../controllers/cart.controller.js";

const router = express.Router();

/* ================= CART ================= */
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeFromCart);

/* ================= AMAZON FEATURES ================= */
router.post("/save-for-later/:productId", protect, saveForLater);
router.post("/move-to-cart/:productId", protect, moveToCart);

export default router;