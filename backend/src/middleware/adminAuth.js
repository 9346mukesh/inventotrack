import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * 🔒 Admin Authorization Middleware
 * - Verifies JWT
 * - Ensures user role is ADMIN
 */
const adminAuth = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("AdminAuth error:", error.message);
    res.status(401).json({ message: "Not authorized" });
  }
};

export default adminAuth;