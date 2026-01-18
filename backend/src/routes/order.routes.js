import express from "express";
import {
  getMyOrders,
  getAllOrders,
  createOrder
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", adminAuth, getAllOrders);

export default router;