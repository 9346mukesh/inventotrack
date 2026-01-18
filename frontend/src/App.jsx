import { Routes, Route, Navigate } from "react-router-dom";

/* ================= USER PAGES ================= */
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import UserDashboard from "./pages/user/UserDashboard";
import ProductList from "./pages/user/ProductList";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import Payment from "./pages/user/Payment";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentFailed from "./pages/user/PaymentFailed";

/* ================= ADMIN PAGES (UNCHANGED) ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

/* ================= LAYOUTS ================= */
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= USER LAYOUT ================= */}
      <Route element={<UserLayout />}>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED USER ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>

      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}

export default App;