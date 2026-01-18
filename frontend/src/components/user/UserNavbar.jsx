import { ShoppingCart, Package, User, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const UserNavbar = ({ cartCount = 0 }) => {
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InventoTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Shop
            </Link>

            <Link 
              to="/orders" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Orders
            </Link>

            <Link 
              to="/cart" 
              className="relative group"
            >
              <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart size={24} className="text-gray-700 group-hover:text-indigo-600" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link 
              to="/products" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>

            <Link 
              to="/orders" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>

            <Link 
              to="/cart" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default UserNavbar;