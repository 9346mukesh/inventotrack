import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw } from "lucide-react";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

const Cart = () => {
  const { cart, loadCart, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put("/cart/update", { productId, quantity });
      loadCart();
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      loadCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    if (!item?.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const shipping = totalAmount > 1000 ? 0 : 99;
  const tax = Math.round(totalAmount * 0.1);
  const finalTotal = totalAmount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <ShoppingBag className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(
              (item) =>
                item.product && (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex gap-5 items-start"
                  >
                    {/* PRODUCT IMAGE */}
                    <div
                      className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/products/${item.product._id}`)}
                    >
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="text-gray-300" size={40} />
                        </div>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors truncate"
                        onClick={() => navigate(`/products/${item.product._id}`)}
                      >
                        {item.product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.product.description}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        {/* QUANTITY CONTROL */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button
                            disabled={item.quantity === 1}
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-4 py-1 font-semibold text-gray-900 min-w-[40px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* REMOVE BUTTON */}
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium ml-auto"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{item.product.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              {/* TITLE */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Shipping</span>
                  <div className="text-right">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium text-sm">FREE</span>
                    ) : (
                      <span className="font-medium">₹{shipping}</span>
                    )}
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-500 italic">
                    Free shipping on orders above ₹1000
                  </p>
                )}
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              {/* CONTINUE SHOPPING */}
              <button
                onClick={() => navigate("/products")}
                className="w-full border-2 border-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              {/* BENEFITS */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <Truck className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-600">On orders above ₹1000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RotateCcw className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-600">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;