import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  IndianRupee,
  Boxes,
  BarChart3,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";

/* ================= CONSTANTS ================= */
const LOW_STOCK_LIMIT = 5;

/* ================= COMPONENT ================= */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        /* PRODUCTS */
        const productRes = await api.get("/admin/products");
        const products = productRes.data.products || [];

        const totalProducts = products.length;
        const lowStock = products.filter(
          p => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
        ).length;

        /* ORDERS - FETCH FROM BACKEND */
        const ordersRes = await api.get("/orders");
        const orders = ordersRes.data.orders || [];
        
        const totalOrders = orders.length;
        const revenue = orders
          .filter(o => o.paymentStatus === "Paid")
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
          totalProducts,
          lowStock,
          totalOrders,
          revenue
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of inventory, orders and revenue
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last updated today</p>
            <p className="text-2xl font-bold text-indigo-600">Welcome back!</p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Package size={24} />}
            color="indigo"
            trend={null}
          />

          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon={<AlertTriangle size={24} />}
            color="red"
            trend={null}
          />

          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart size={24} />}
            color="green"
            trend={null}
          />

          <StatCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={24} />}
            color="yellow"
            trend={null}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              to="/admin/products"
              icon={<Boxes size={24} />}
              label="Manage Products"
              description="Add, edit or delete products"
              color="indigo"
            />

            <ActionCard
              to="/admin/inventory"
              icon={<BarChart3 size={24} />}
              label="Inventory Tracking"
              description="Monitor stock levels"
              color="green"
            />

            <ActionCard
              to="/admin/orders"
              icon={<ClipboardList size={24} />}
              label="Order Management"
              description="Process and track orders"
              color="blue"
            />

            <ActionCard
              to="/admin/analytics"
              icon={<TrendingUp size={24} />}
              label="Sales Analytics"
              description="View detailed reports"
              color="yellow"
            />
          </div>
        </div>

        {/* CHARTS & INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SALES CHART */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Sales Trend</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <TrendingUp size={20} />
              </button>
            </div>
            <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Sales Chart</p>
                <p className="text-sm text-gray-400">Coming in next update</p>
              </div>
            </div>
          </div>

          {/* INVENTORY CHART */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Stock Movement</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <BarChart3 size={20} />
              </button>
            </div>
            <div className="h-64 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Inventory Chart</p>
                <p className="text-sm text-gray-400">Coming in next update</p>
              </div>
            </div>
          </div>
        </div>

        {/* KEY METRICS */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Key Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversion Rate */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <ArrowUpRight size={16} />
                  3.2%
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <p className="text-xs text-gray-500 mt-1">vs 65% last period</p>
            </div>

            {/* Avg Order Value */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                  <ArrowDownLeft size={16} />
                  2.1%
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹5,500</p>
              <p className="text-xs text-gray-500 mt-1">vs ₹5,615 last period</p>
            </div>

            {/* Customer Satisfaction */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Satisfaction</p>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <ArrowUpRight size={16} />
                  1.5%
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.8/5.0</p>
              <p className="text-xs text-gray-500 mt-1">Based on 320 reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================= STAT CARD WITH TREND ================= */
const ActionCard = ({ to, icon, label, description, color }) => {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25",
    green: "from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25",
    blue: "from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/25",
    yellow: "from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/25"
  };

  return (
    <Link
      to={to}
      className={`relative overflow-hidden group bg-gradient-to-br ${colors[color]} text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105`}
    >
      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
      <div className="relative">
        <div className="mb-4 p-3 bg-white/20 rounded-lg w-fit group-hover:bg-white/30 transition-colors">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{label}</h3>
        <p className="text-sm text-white/80 mt-1">{description}</p>
      </div>
    </Link>
  );
};