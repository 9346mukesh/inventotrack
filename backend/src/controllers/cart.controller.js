import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

/* ================= HELPER ================= */
const populateCart = async (cart) => {
  await cart.populate(
    "items.product",
    "name price images stock reservedStock"
  );
  await cart.populate(
    "savedForLater.product",
    "name price images stock reservedStock"
  );
  return cart;
};

/* ================= GET CART ================= */
/**
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      savedForLater: []
    });
  }

  await populateCart(cart);
  res.json(cart);
};

/* ================= ADD TO CART ================= */
/**
 * POST /api/cart/add
 */
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.availableStock < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      savedForLater: []
    });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  /* Reserve stock */
  product.reservedStock += quantity;
  await product.save();

  await cart.save();
  await populateCart(cart);

  res.json(cart);
};

/* ================= UPDATE CART ITEM ================= */
/**
 * PUT /api/cart/update
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(productId);
    const diff = quantity - item.quantity;

    if (diff > 0 && product.availableStock < diff) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Ensure reservedStock doesn't go below 0
    product.reservedStock = Math.max(0, product.reservedStock + diff);
    item.quantity = quantity;

    await product.save();
    await cart.save();
    await populateCart(cart);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update cart item",
      error: error.message 
    });
  }
};

/* ================= REMOVE FROM CART ================= */
/**
 * DELETE /api/cart/remove/:productId
 */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(item.product);
    
    // Ensure reservedStock doesn't go below 0
    product.reservedStock = Math.max(0, product.reservedStock - item.quantity);

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    await product.save();
    await cart.save();
    await populateCart(cart);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to remove item from cart",
      error: error.message 
    });
  }
};

/* ================= SAVE FOR LATER ================= */
/**
 * POST /api/cart/save-for-later/:productId
 */
export const saveForLater = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(item.product);

    /* Release reserved stock - ensure it doesn't go below 0 */
    product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
    await product.save();

    /* Remove from cart */
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    /* Add to saved for later */
    cart.savedForLater.push({
      product: item.product
    });

    await cart.save();
    await populateCart(cart);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to save for later",
      error: error.message 
    });
  }
};

/* ================= MOVE BACK TO CART ================= */
/**
 * POST /api/cart/move-to-cart/:productId
 */
export const moveToCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const saved = cart.savedForLater.find(
    (i) => i.product.toString() === req.params.productId
  );
  if (!saved) return res.status(404).json({ message: "Item not found" });

  const product = await Product.findById(saved.product);
  if (product.availableStock < 1) {
    return res.status(400).json({ message: "Out of stock" });
  }

  /* Reserve stock again */
  product.reservedStock += 1;
  await product.save();

  /* Remove from saved */
  cart.savedForLater = cart.savedForLater.filter(
    (i) => i.product.toString() !== req.params.productId
  );

  /* Add back to cart */
  cart.items.push({
    product: saved.product,
    quantity: 1
  });

  await cart.save();
  await populateCart(cart);

  res.json(cart);
};