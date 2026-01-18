import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Menu,
  LayoutDashboard,
  Package,
  BarChart3,
  ClipboardList,
  TrendingUp,
  LogOut,
  ChevronRight,
  User
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Generate breadcrumb from pathname
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbArray = [{ label: "Dashboard", path: "/admin" }];

    if (paths.length > 1) {
      const routeMap = {
        products: "Products",
        inventory: "Inventory",
        orders: "Orders",
        analytics: "Analytics"
      };

      for (let i = 1; i < paths.length; i++) {
        const segment = paths[i];
        const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const path = "/" + paths.slice(0, i + 1).join("/");
        breadcrumbArray.push({ label, path });
      }
    }

    return breadcrumbArray;
  }, [pathname]);

  // Get admin initials
  const adminInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto`}
      >
        {/* ADMIN PROFILE SECTION */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-white flex-shrink-0">
              {adminInitials}
            </div>

            {/* PROFILE INFO */}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TOP BAR */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!collapsed && (
            <h2 className="text-lg font-bold tracking-wide">
              Admin
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-indigo-400"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            to="/admin"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            end
          />
          <NavItem
            to="/admin/products"
            icon={Package}
            label="Manage Products"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/inventory"
            icon={BarChart3}
            label="Inventory Tracking"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/orders"
            icon={ClipboardList}
            label="Order Management"
            collapsed={collapsed}
          />
          <NavItem
            to="/admin/analytics"
            icon={TrendingUp}
            label="Sales Analytics"
            collapsed={collapsed}
          />
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-500 w-full"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`${collapsed ? "ml-20" : "ml-64"} flex-1 flex flex-col bg-gray-100 overflow-y-auto transition-all duration-300`}>
        {/* BREADCRUMB NAVIGATION */}
        <div className="bg-white shadow-sm px-8 py-4 border-b border-gray-200">
          <nav className="flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center gap-2">
                <button
                  onClick={() => navigate(breadcrumb.path)}
                  className={`text-sm font-medium transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 cursor-default"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  {breadcrumb.label}
                </button>

                {index < breadcrumbs.length - 1 && (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

/* ================= REUSABLE NAV ITEM ================= */
const NavItem = ({ to, icon: Icon, label, collapsed, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-gray-300 hover:bg-slate-800"
        }`
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};