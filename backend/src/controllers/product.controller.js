import Product from "../models/product.model.js";

/* ================= GET ALL PRODUCTS (PUBLIC + ADMIN) ================= */
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const filter = { isActive: true };

    // 🔍 SEARCH
    if (search) {
      filter.$text = { $search: search };
    }

    // 📂 CATEGORY FILTER
    if (category) {
      filter.category = category;
    }

    // ↕ SORT
    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

/* ================= CREATE PRODUCT (ADMIN) ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      images = [],
      stock = 0,
      lowStockThreshold = 5
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
      lowStockThreshold
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }
};

/* ================= UPDATE PRODUCT (ADMIN) ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
};

/* ================= DELETE PRODUCT (ADMIN) ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};