import Stripe from "stripe";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/webhooks/stripe
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    
    try {
      const order = await Order.findById(intent.metadata.orderId);

      if (!order) {
        console.error("❌ Webhook: Order not found:", intent.metadata.orderId);
        return res.status(404).json({ message: "Order not found" });
      }

      // Validate payment amount matches order total
      const expectedAmount = Math.round(order.totalAmount * 100);
      if (intent.amount_received !== expectedAmount) {
        console.error("❌ Payment amount mismatch!");
        console.error(`  Expected: ${expectedAmount}, Received: ${intent.amount_received}`);
        return res.status(400).json({ message: "Payment amount mismatch" });
      }

      // Validate currency
      if (intent.currency !== "inr") {
        console.error("❌ Invalid currency:", intent.currency);
        return res.status(400).json({ message: "Invalid currency" });
      }

      console.log("✅ Payment validated: ₹", order.totalAmount);

      order.paymentStatus = "Paid";
      order.orderStatus = "Paid";
      order.paymentIntentId = intent.id;
      await order.save();

      // Update product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
          await product.save();
        }
      }

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], savedForLater: [] }
      );
    } catch (error) {
      console.error("Error processing payment success webhook:", error);
      return res.status(500).json({ message: "Webhook processing failed" });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    
    try {
      const order = await Order.findById(intent.metadata.orderId);

      if (order) {
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
      }
    } catch (error) {
      console.error("Error processing payment failure webhook:", error);
    }
  }

  res.json({ received: true });
};