import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    items: [orderItemSchema],

    totalAmount: Number,

    paymentIntentId: String,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    orderStatus: {
      type: String,
      enum: ["Processing", "Paid", "Failed"],
      default: "Processing"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);