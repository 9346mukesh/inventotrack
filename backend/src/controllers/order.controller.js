import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

/**
 * CREATE ORDER FROM CART
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check if there's already a pending order for this user
    const existingPendingOrder = await Order.findOne({
      user: req.user._id,
      paymentStatus: "Pending",
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } // Within last 10 minutes
    });

    if (existingPendingOrder) {
      console.log("⚠️ Returning existing pending order:", existingPendingOrder._id);
      return res.status(200).json(existingPendingOrder);
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Processing"
    });

    console.log("✅ New order created:", order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

/**
 * USER: get my orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

/**
 * ADMIN: get all orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};