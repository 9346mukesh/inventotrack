import Product from "../models/product.model.js";

/**
 * Reserve stock safely
 */
export const reserveStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  if (product.availableStock < quantity) {
    throw new Error("Insufficient stock");
  }

  product.reservedStock += quantity;
  await product.save();
};

/**
 * Release reserved stock
 */
export const releaseStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) return;

  product.reservedStock = Math.max(
    product.reservedStock - quantity,
    0
  );

  await product.save();
};

/**
 * Deduct stock permanently (after payment success)
 */
export const deductStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  product.stock -= quantity;
  product.reservedStock = Math.max(
    product.reservedStock - quantity,
    0
  );

  await product.save();
};