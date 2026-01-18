import express from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

export default router;