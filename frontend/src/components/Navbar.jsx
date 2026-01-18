import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center">
      <h3 className="text-xl font-bold">InventoTrack</h3>

      <div className="flex gap-6 items-center">
        {/* COMMON */}
        <Link to="/products" className="hover:text-indigo-400">
          Products
        </Link>

        {/* 👤 NORMAL USER ONLY */}
        {user && user.role === "customer" && (
          <>
            <Link to="/cart" className="hover:text-indigo-400">
              Cart ({cart.length})
            </Link>

            <Link to="/orders" className="hover:text-indigo-400">
              Orders
            </Link>
          </>
        )}

        {/* 🛠 ADMIN ONLY */}
        {user && user.role === "admin" && (
          <Link to="/admin" className="hover:text-indigo-400">
            Admin
          </Link>
        )}

        {/* AUTH */}
        {!user ? (
          <Link
            to="/login"
            className="bg-indigo-600 px-4 py-1 rounded hover:bg-indigo-700"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;