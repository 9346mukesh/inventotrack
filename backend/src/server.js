// ✅ Load environment variables FIRST (ESM-safe)
import "./env.js";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "./cron/stockRelease.cron.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminProductRoutes from "./routes/adminProduct.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

// Connect DB
connectDB();

const app = express();

// Enable CORS with production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL // Add your Vercel URL in production
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow Vercel preview deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    // Allow configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

/* ================= STRIPE WEBHOOK (NO BODY PARSER HERE) ================= */
// Important: Webhook route must be BEFORE express.json() middleware
// The webhook route uses express.raw() internally
app.use("/api/webhooks", webhookRoutes);

/* ================= NORMAL BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH ================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "InventoTrack Backend",
    environment: process.env.NODE_ENV || "development"
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});