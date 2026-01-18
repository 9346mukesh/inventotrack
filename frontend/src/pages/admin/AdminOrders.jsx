import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ALL ORDERS (ADMIN) ================= */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // ✅ Admin endpoint (protected + adminOnly)
        const res = await api.get("/orders");
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* ================= ORDER STATS ================= */
  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    o => o.paymentStatus === "Paid"
  ).length;

  const pendingOrders = orders.filter(
    o => o.paymentStatus === "Pending" || o.paymentStatus === "Processing"
  ).length;

  const failedOrders = orders.filter(
    o => o.paymentStatus === "Failed"
  ).length;

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Order Management
        </h1>
        <p className="text-gray-500">
          Track and manage all customer orders
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          color="blue"
          trend={null}
        />
        <StatCard
          title="Paid Orders"
          value={paidOrders}
          color="green"
          trend={null}
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          color="yellow"
          trend={null}
        />
        <StatCard
          title="Failed Orders"
          value={failedOrders}
          color="red"
          trend={null}
        />
      </div>

      {/* ================= ORDERS TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th>User</th>
              <th>Total (₹)</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-mono text-xs text-gray-700">
                  {order._id}
                </td>

                {/* ✅ FIXED: correct user field */}
                <td>
                  {order.user?.email || order.userEmail || "User deleted"}
                </td>

                <td className="font-semibold">
                  ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                </td>

                <td>
                  <StatusBadge value={order.paymentStatus} />
                </td>

                <td>
                  <StatusBadge value={order.orderStatus} />
                </td>

                <td className="text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>

                <td className="text-center">
                  <button
                    className="text-indigo-600 hover:text-indigo-800"
                    title="View order"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminOrders;

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ value }) => {
  const styles = {
    Paid: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-indigo-100 text-indigo-700"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[value] || "bg-gray-100 text-gray-600"
      }`}
    >
      {value || "—"}
    </span>
  );
};