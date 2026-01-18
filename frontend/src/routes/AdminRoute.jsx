import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If children were provided (e.g., wrapping a layout), render them
  // Otherwise fall back to Outlet for nested routes
  return children || <Outlet />;
};

export default AdminRoute;