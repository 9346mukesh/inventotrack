import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/product.controller.js";

import adminAuth from "../middleware/adminAuth.js";
import Product from "../models/product.model.js";

const router = express.Router();

/* ================= ADMIN PRODUCT ROUTES ================= */

// 🔹 Get all products (Admin – with filters, pagination)
router.get("/", adminAuth, getAllProducts);

// 🔹 Create product
router.post("/", adminAuth, createProduct);

// 🔹 Update product
router.put("/:id", adminAuth, updateProduct);

// 🔹 Delete product
router.delete("/:id", adminAuth, deleteProduct);

/* ================= CATEGORY LIST (IMPORTANT) ================= */
// 👉 Used by frontend category dropdown
router.get("/categories", adminAuth, async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message
    });
  }
});

export default router;