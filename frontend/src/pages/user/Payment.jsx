import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { CreditCard, Lock, AlertCircle, Loader } from "lucide-react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart } = useCart();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);

  /* ================= GET ORDER AMOUNT FROM BACKEND ================= */
  useEffect(() => {
    // Priority 1: Use orderData passed from Checkout (has backend totalAmount)
    if (state?.orderData?.totalAmount) {
      console.log("Using order data from checkout:", state.orderData.totalAmount);
      setOrderAmount(state.orderData.totalAmount);
      return;
    }
    
    // Priority 2: Calculate from cart if available
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
        const total = subtotal + tax;
        
        setOrderAmount(Math.max(0, total));
        console.log("Calculated amount from cart:", Math.max(0, total));
      } catch (err) {
        console.error("Error calculating from cart:", err);
        setOrderAmount(0);
      }
    } else {
      console.warn("No cart data and no orderData from checkout");
      setOrderAmount(0);
    }
  }, [cart, state]);

  const handlePayment = async () => {
    if (!stripe || !elements || !state?.clientSecret || processing) return;

    setProcessing(true);
    setError("");

    try {
      const result = await stripe.confirmCardPayment(
        state.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        }
      );

      if (result.error) {
        // Payment failed - mark order as Failed in backend
        console.error("❌ Payment error:", result.error.message);
        setError(result.error.message);

        try {
          // Call verify endpoint to mark order as Failed
          console.log("🌐 Calling verification endpoint to mark order as Failed...");
          await api.post(
            "/payments/verify",
            { orderId: state.orderId }
          );
          console.log("✅ Order marked as Failed");
        } catch (verifyError) {
          console.error("⚠️ Failed to mark order as Failed:", verifyError);
        }

        setProcessing(false);
        // Show error, don't navigate - user can retry
      } else if (result.paymentIntent.status === "succeeded") {
        // Payment succeeded - verify with backend to update order status
        console.log("✅ Payment confirmed by Stripe, verifying with backend...");
        console.log("📋 Order ID:", state.orderId);
        console.log("🔑 Payment Intent ID:", result.paymentIntent.id);

        // Set processing to keep the button disabled
        setProcessing(true);

        try {
          // Call verify endpoint to update order status (fallback for webhook)
          console.log("🌐 Calling verification endpoint...");
          const verifyResponse = await api.post(
            "/payments/verify",
            { orderId: state.orderId }
          );
          console.log("✅ Payment verified with backend:", verifyResponse.data);

          // Wait a moment to ensure DB is updated
          await new Promise(resolve => setTimeout(resolve, 500));

          // Navigate to success page with orderId
          navigate("/payment-success", {
            state: {
              orderId: state.orderId
            }
          });
        } catch (verifyError) {
          console.error("⚠️ Verification error:", verifyError);
          console.error("⚠️ Error response:", verifyError.response?.data);
          console.error("⚠️ Error details:", verifyError.message);

          // Still navigate to success - webhook might handle it
          navigate("/payment-success", {
            state: {
              orderId: state.orderId
            }
          });
        }
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <CreditCard size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Secure Payment</h1>
            <p className="text-indigo-100">Complete your purchase safely</p>
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">
            {/* AMOUNT */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-indigo-600 font-medium mb-1">Order Total</p>
              <p className="text-4xl font-bold text-indigo-600">
                {orderAmount > 0 ? `₹${orderAmount.toLocaleString("en-IN")}` : "Loading..."}
              </p>
            </div>

            {/* CARD INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Card Details
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#111827",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        "::placeholder": {
                          color: "#9ca3af"
                        }
                      },
                      invalid: {
                        color: "#ef4444"
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Payment Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* PAY BUTTON */}
            <button
              onClick={handlePayment}
              disabled={!stripe || processing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white py-4 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {processing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay Securely
                </>
              )}
            </button>

            {/* SECURITY INFO */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
              <Lock size={16} className="text-green-600" />
              <span>Secure payment by <span className="font-semibold">Stripe</span></span>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl mb-1">🔒</p>
                <p className="text-xs font-medium text-gray-600">Encrypted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">✓</p>
                <p className="text-xs font-medium text-gray-600">Verified</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">🛡️</p>
                <p className="text-xs font-medium text-gray-600">Secure</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">🌍</p>
                <p className="text-xs font-medium text-gray-600">Global</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEST CARD INFO */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-semibold mb-1">💳 Test Card Information</p>
          <p>Card Number: 4242 4242 4242 4242</p>
          <p>Expiry: Any future date</p>
          <p>CVC: Any 3 digits</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;