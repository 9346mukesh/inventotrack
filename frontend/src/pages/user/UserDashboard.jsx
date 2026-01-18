import { Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your shopping, orders, and cart from here
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PRODUCTS */}
        <DashboardCard
          to="/products"
          title="Browse Products"
          description="Explore all available products"
          icon={<ShoppingBag size={32} />}
          color="bg-indigo-600"
        />

        {/* CART */}
        <DashboardCard
          to="/cart"
          title="My Cart"
          description="View items added to your cart"
          icon={<ShoppingCart size={32} />}
          color="bg-emerald-600"
        />

        {/* ORDERS */}
        <DashboardCard
          to="/orders"
          title="My Orders"
          description="Track your previous purchases"
          icon={<Package size={32} />}
          color="bg-orange-600"
        />
      </div>
    </div>
  );
};

export default UserDashboard;

/* ================= REUSABLE CARD ================= */

const DashboardCard = ({ to, title, description, icon, color }) => {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex items-center gap-5"
    >
      <div
        className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {description}
        </p>
      </div>
    </Link>
  );
};