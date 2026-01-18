import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    /** 🧮 REAL STOCK */
    stock: {
      type: Number,
      required: true,
      min: 0
    },

    /** 🔒 RESERVED STOCK (15-min cart lock) */
    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    },

    /** ⚠️ LOW STOCK ALERT */
    lowStockThreshold: {
      type: Number,
      default: 5
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /** ⭐ REVIEWS */
    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

/**
 * ✅ Virtual: Available Stock
 * Amazon-style logic
 * available = stock - reservedStock
 */
productSchema.virtual("availableStock").get(function () {
  return Math.max(this.stock - this.reservedStock, 0);
});

/**
 * Ensure virtuals are returned in JSON
 */
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);