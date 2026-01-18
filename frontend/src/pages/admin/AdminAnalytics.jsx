import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";

/* ================= CONSTANTS ================= */
const STATUS_COLORS = {
  Paid: "#10b981",
  Pending: "#f59e0b",
  Failed: "#ef4444"
};

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    pendingOrders: 0,
    failedOrders: 0
  });

  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ANALYTICS ================= */
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await api.get("/orders");
        const orders = res.data?.orders || [];

        const paid = orders.filter(o => o.paymentStatus === "Paid");
        const pending = orders.filter(o => o.paymentStatus === "Pending");
        const failed = orders.filter(o => o.paymentStatus === "Failed");

        const totalRevenue = paid.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        );

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          paidOrders: paid.length,
          pendingOrders: pending.length,
          failedOrders: failed.length
        });

        const revenueByDate = {};
        paid.forEach(order => {
          const date = new Date(order.createdAt).toLocaleDateString();
          revenueByDate[date] =
            (revenueByDate[date] || 0) + order.totalAmount;
        });

        setTrend(
          Object.entries(revenueByDate).map(([date, revenue]) => ({
            date,
            revenue
          }))
        );
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading analytics...
      </p>
    );
  }

  const pieData = [
    { name: "Paid", value: stats.paidOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "Failed", value: stats.failedOrders }
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Sales Analytics</h1>
        <p className="text-gray-500">
          Track revenue and order performance
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={22} />} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} icon={<IndianRupee size={22} />} color="emerald" />
        <StatCard title="Paid" value={stats.paidOrders} icon={<CheckCircle size={22} />} color="green" />
        <StatCard title="Pending" value={stats.pendingOrders} icon={<Clock size={22} />} color="yellow" />
        <StatCard title="Failed" value={stats.failedOrders} icon={<XCircle size={22} />} color="red" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= REVENUE TREND ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Revenue Trend
          </h2>

          {trend.length === 0 ? (
            <p className="text-gray-400 text-center py-24">
              No revenue data yet
            </p>
          ) : (
            <LineChart
              width={520}
              height={300}
              data={trend}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </div>

        {/* ================= ORDER STATUS PIE ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Order Status Breakdown
          </h2>

          <PieChart width={320} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              isAnimationActive={false}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={STATUS_COLORS[entry.name]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;