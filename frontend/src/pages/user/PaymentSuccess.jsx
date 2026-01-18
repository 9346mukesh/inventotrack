import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import api from "../../api/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details if we have the orderId
    const fetchOrderDetails = async () => {
      if (state?.orderId) {
        try {
          const res = await api.get(`/orders/${state.orderId}`);
          console.log("Order details fetched:", res.data);
          setOrderDetails(res.data);
        } catch (err) {
          console.error("Failed to fetch order:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [state?.orderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Pass state to indicate payment just completed
      navigate("/orders", { state: { paymentCompleted: true } });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Thank you for your purchase</p>
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-6">
            {/* CONFIRMATION MESSAGE */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-900 font-medium">
                Your order has been confirmed and will be processed shortly
              </p>
            </div>

            {/* ORDER DETAILS */}
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">
                  {orderDetails?._id ? `#${orderDetails._id.slice(-8).toUpperCase()}` : "#ORD-LOADING"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  {orderDetails?.totalAmount 
                    ? `₹${orderDetails.totalAmount.toLocaleString("en-IN")}`
                    : "₹0"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded font-semibold text-xs">
                  <CheckCircle size={14} />
                  Confirmed
                </span>
              </div>
            </div>

            {/* WHAT'S NEXT */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package size={18} className="text-indigo-600" />
                What's Next?
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ You'll receive a confirmation email shortly</p>
                <p>✓ Your order will be shipped within 24-48 hours</p>
                <p>✓ Track your package in "My Orders"</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/orders")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                View My Orders
                <ArrowRight size={18} />
              </button>

              <Link
                to="/products"
                className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>

            {/* AUTO REDIRECT INFO */}
            <p className="text-xs text-gray-500 text-center">
              Redirecting to your orders in a moment...
            </p>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl mb-1">📧</p>
            <p className="text-xs font-medium text-gray-600">Email Confirmation</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">📦</p>
            <p className="text-xs font-medium text-gray-600">Shipment Tracking</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">✓</p>
            <p className="text-xs font-medium text-gray-600">Order Secured</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;