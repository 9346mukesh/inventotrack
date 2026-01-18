import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ArrowRight, CreditCard, Loader } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });

  /* ================= CALCULATE ORDER SUMMARY ================= */
  useEffect(() => {
    // If we have order data from backend, use it
    if (orderData?.totalAmount) {
      console.log("Using order data from backend:", orderData);
      
      // Estimate breakdown from total
      const total = orderData.totalAmount;
      const tax = Math.round(total / 1.1 * 0.1);
      const subtotal = total - tax;
      
      setOrderSummary({
        subtotal: Math.max(0, subtotal),
        tax: Math.max(0, tax),
        shipping: 0,
        total: Math.max(0, total)
      });
      return;
    }
    
    // Otherwise calculate from cart
    if (cart && cart.length > 0) {
      try {
        let subtotal = 0;
        
        for (const item of cart) {
          const price = item.price || item.productPrice || 0;
          const quantity = item.quantity || item.qty || 1;
          
          if (typeof price === 'number' && typeof quantity === 'number') {
            subtotal += price * quantity;
          }
        }
        
        if (!subtotal || isNaN(subtotal)) {
          console.warn("Cart calculation failed");
          subtotal = 0;
        }
        
        const tax = Math.round(subtotal * 0.1);
        const shipping = subtotal >= 1000 ? 0 : 0;
        const total = subtotal + tax + shipping;

        setOrderSummary({
          subtotal: Math.max(0, subtotal),
          tax: Math.max(0, tax),
          shipping: Math.max(0, shipping),
          total: Math.max(0, total)
        });
      } catch (err) {
        console.error("Error calculating order summary:", err);
        setOrderSummary({
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        });
      }
    }
  }, [cart, orderData]);

  const handleCheckout = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const orderRes = await api.post("/orders");
      console.log("Order created:", orderRes.data);
      
      // Store order data for display
      setOrderData(orderRes.data);
      
      const paymentRes = await api.post("/payments/create-intent", {
        orderId: orderRes.data._id
      });

      // Pass order details to Payment page
      navigate("/payment", {
        state: {
          clientSecret: paymentRes.data.clientSecret,
          orderId: orderRes.data._id,
          orderData: orderRes.data  // Pass order data with totalAmount
        }
      });
    } catch (err) {
      console.error("Checkout failed", err);
      setError(
        err.response?.data?.message || "Checkout failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your purchase securely</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* PROGRESS STEPS */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
                ✓
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">Cart</p>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                2
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">Checkout</p>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-bold">
                3
              </div>
              <p className="ml-3 text-sm font-medium text-gray-600">Payment</p>
            </div>
          </div>

          {/* SHIPPING INFO */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Information
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">📍 Shipping Details:</span> We'll
                use the address associated with your account. You can update
                this in your profile.
              </p>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal > 0 ? orderSummary.subtotal.toLocaleString("en-IN") : "0"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">
                  {orderSummary.shipping === 0 ? "FREE" : `₹${orderSummary.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>₹{orderSummary.tax > 0 ? orderSummary.tax.toLocaleString("en-IN") : "0"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-3xl font-bold text-indigo-600">₹{orderSummary.total > 0 ? orderSummary.total.toLocaleString("en-IN") : "0"}</span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* PAYMENT METHOD */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-indigo-600 rounded-lg cursor-pointer bg-indigo-50">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard size={18} />
                    Credit/Debit Card
                  </p>
                  <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                </div>
              </label>
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* SECURITY INFO */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700">
              🔒 <span className="font-semibold">Your payment is secure</span>
            </p>
            <p className="text-xs text-green-600 mt-1">
              All transactions are encrypted and verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;