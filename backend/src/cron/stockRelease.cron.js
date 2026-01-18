import cron from "node-cron";
import Cart from "../models/cart.model.js";
import { releaseStock } from "../utils/stock.util.js";

/**
 * 🕒 Release reserved stock after 15 minutes
 */
cron.schedule("* * * * *", async () => {
  const EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes
  const expiryDate = new Date(Date.now() - EXPIRY_TIME);

  try {
    const expiredCarts = await Cart.find({
      updatedAt: { $lt: expiryDate },
      items: { $exists: true, $ne: [] }
    });

    for (const cart of expiredCarts) {
      for (const item of cart.items) {
        await releaseStock(item.product, item.quantity);
      }

      cart.items = [];
      await cart.save();
    }

    if (expiredCarts.length > 0) {
      console.log(
        `🟡 Stock released for ${expiredCarts.length} abandoned carts`
      );
    }
  } catch (error) {
    console.error("Stock release cron failed:", error.message);
  }
});