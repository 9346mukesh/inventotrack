import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

/**
 * @desc    Create Stripe PaymentIntent for an order
 * @route   POST /api/payments/create-intent
 * @access  User
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized order access" });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // 🔥 Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // 🔥 CRITICAL: save PaymentIntent ID
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    console.log(
      "🧾 PaymentIntent created:",
      paymentIntent.id,
      "for order:",
      order._id
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message
    });
  }
};

/**
 * @desc    Verify payment status and update order (fallback for webhook)
 * @route   POST /api/payments/verify
 * @access  User
 */
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    console.log("🔍 =================================");
    console.log("🔍 PAYMENT VERIFICATION REQUEST");
    console.log("🔍 Order ID:", orderId);
    console.log("🔍 User ID:", req.user._id);
    console.log("🔍 =================================");

    if (!orderId) {
      console.log("❌ No order ID provided");
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.log("❌ Order not found:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("📋 Order found:");
    console.log("  - Payment Status:", order.paymentStatus);
    console.log("  - Order Status:", order.orderStatus);
    console.log("  - Payment Intent ID:", order.paymentIntentId);

    if (order.user.toString() !== req.user._id.toString()) {
      console.log("❌ Unauthorized access attempt");
      return res.status(403).json({ message: "Unauthorized order access" });
    }

    // Check if already paid
    if (order.paymentStatus === "Paid") {
      console.log("✅ Payment already verified");
      return res.status(200).json({ 
        message: "Payment already verified",
        paymentStatus: "Paid",
        orderStatus: "Paid"
      });
    }

    // Retrieve PaymentIntent from Stripe
    if (!order.paymentIntentId) {
      console.log("❌ No payment intent found");
      return res.status(400).json({ message: "No payment intent found for this order" });
    }

    console.log("🔎 Retrieving PaymentIntent from Stripe...");
    const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    console.log("💳 PaymentIntent Status:", paymentIntent.status);

    // If payment succeeded, validate and update order
    if (paymentIntent.status === "succeeded") {
      // Validate payment amount matches order total
      const expectedAmount = Math.round(order.totalAmount * 100);
      if (paymentIntent.amount_received !== expectedAmount) {
        console.error("❌ Payment amount mismatch!");
        console.error(`  Expected: ${expectedAmount}, Received: ${paymentIntent.amount_received}`);
        return res.status(400).json({
          message: "Payment amount mismatch",
          paymentStatus: "Failed",
          orderStatus: "Failed"
        });
      }

      // Validate currency
      if (paymentIntent.currency !== "inr") {
        console.error("❌ Invalid currency:", paymentIntent.currency);
        return res.status(400).json({
          message: "Invalid currency",
          paymentStatus: "Failed",
          orderStatus: "Failed"
        });
      }

      console.log("✅ Payment verified as succeeded, updating order...");
      
      order.paymentStatus = "Paid";
      order.orderStatus = "Paid";
      await order.save();
      
      console.log("✅ Order saved with new status");

      // Update product stock
      console.log("📦 Updating product stock...");
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          console.log(`  - Product ${product.name}: stock ${product.stock} -> ${Math.max(0, product.stock - item.quantity)}`);
          product.stock = Math.max(0, product.stock - item.quantity);
          product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
          await product.save();
        }
      }

      // Clear cart
      console.log("🛒 Clearing cart...");
      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], savedForLater: [] }
      );

      console.log("✅ ========================================");
      console.log("✅ ORDER VERIFICATION COMPLETED");
      console.log("✅ Order ID:", order._id);
      console.log("✅ ========================================");

      return res.status(200).json({
        message: "Payment verified successfully",
        paymentStatus: "Paid",
        orderStatus: "Paid"
      });
    } else if (paymentIntent.status === "processing") {
      console.log("⏳ Payment is processing");
      return res.status(200).json({
        message: "Payment is processing",
        paymentStatus: "Pending",
        orderStatus: "Processing"
      });
    } else {
      // Payment failed or requires action
      console.log("❌ Payment verification failed, status:", paymentIntent.status);
      order.paymentStatus = "Failed";
      order.orderStatus = "Failed";
      await order.save();

      // Release reserved stock when payment fails
      console.log("📦 Releasing reserved stock due to payment failure...");
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          console.log(`  - Product ${product.name}: reserved stock ${product.reservedStock} -> ${Math.max(0, product.reservedStock - item.quantity)}`);
          product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
          await product.save();
        }
      }
      console.log("✅ Reserved stock released");

      return res.status(400).json({
        message: "Payment verification failed",
        paymentStatus: "Failed",
        orderStatus: "Failed"
      });
    }
  } catch (error) {
    console.error("❌ ========================================");
    console.error("❌ ERROR VERIFYING PAYMENT");
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);
    console.error("❌ ========================================");
    res.status(500).json({
      message: "Failed to verify payment",
      error: error.message
    });
  }
};