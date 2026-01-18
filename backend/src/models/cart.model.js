import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  reservedUntil: Date // ⏱ 15-min stock lock
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },

    items: [cartItemSchema],

    savedForLater: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);