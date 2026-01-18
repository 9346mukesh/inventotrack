import Product from "../models/product.model.js";

/* ADMIN: GET PRODUCTS */
export const getAdminProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments();

  res.json({ products, total });
};

/* ADMIN: ADD PRODUCT */
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

/* ADMIN: UPDATE PRODUCT (STOCK, PRICE, ETC) */
export const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updated);
};

/* ADMIN: SOFT DELETE */
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    isActive: false
  });

  res.json({ message: "Product disabled" });
};

/* ADMIN: LOW STOCK */
export const getLowStockProducts = async (req, res) => {
  const products = await Product.find({
    isActive: true,
    $expr: { $lte: ["$stock", "$lowStockThreshold"] }
  });

  res.json(products);
};