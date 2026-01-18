import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPaymentIntent,
  verifyPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-intent", protect, createPaymentIntent);
router.post("/verify", protect, verifyPayment);

export default router;