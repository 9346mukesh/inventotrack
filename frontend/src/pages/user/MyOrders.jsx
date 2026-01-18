import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import {
  Package,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Truck
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  const fetchOrders = () => {
    setLoading(true);
    getMyOrders()
      .then((res) => {
        console.log("📦 Orders fetched:", res.data.orders);
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch orders:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();

    // If returning from payment, show success message
    if (location.state?.paymentCompleted) {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-8">
            Once you place an order, it will appear here
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Start Shopping
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SUCCESS BANNER */}
        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-5 flex items-start gap-4 animate-fadeIn">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-green-900">Payment Successful! 🎉</p>
              <p className="text-sm text-green-700 mt-1">Your order has been confirmed and will be processed shortly.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-600 hover:text-green-700 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your purchases and payment status
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                {/* TOP ROW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Order ID
                    </p>
                    <p className="font-mono text-sm font-medium text-gray-900">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Order Date
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-indigo-600 flex-shrink-0" />
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Payment Status
                    </p>
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* BOTTOM ROW */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Order Status */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-500' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-500' :
                          order.orderStatus === 'Processing' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <p className="font-semibold text-gray-900">
                          {order.orderStatus || "Processing"}
                        </p>
                      </div>
                    </div>

                    {/* Items Count */}
                    {order.items && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="font-semibold text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors font-medium">
                      <Truck size={16} />
                      Track
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ITEMS PREVIEW */}
              {order.items && order.items.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-4">
                  <p className="text-xs font-semibold text-gray-600 mb-3">Items in this order:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                        {item.productId?.name || 'Product'} x{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const styles = {
    Paid: {
      icon: <CheckCircle size={16} />,
      className: "bg-green-100 text-green-700 border border-green-300"
    },
    Pending: {
      icon: <Clock size={16} />,
      className: "bg-yellow-100 text-yellow-700 border border-yellow-300"
    },
    Failed: {
      icon: <XCircle size={16} />,
      className: "bg-red-100 text-red-700 border border-red-300"
    }
  };

  const config = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${config.className}`}
    >
      {config.icon}
      {status || "Pending"}
    </span>
  );
};