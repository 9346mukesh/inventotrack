import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added
  
  // Get success message from navigation state
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ prevent double submit

    try {
      const res = await loginUser({ email, password });

      // Save user + token in AuthContext
      login(res.data);

      // 🔥 ROLE-BASED REDIRECT (UNCHANGED)
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f5c] via-[#3a3f9f] to-[#6b7cff]">
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl bg-white/10 border border-white/20">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900/80 to-indigo-700/80 text-white">
            <div>
              <h1 className="text-4xl font-extrabold">InventoTrack</h1>
              <p className="mt-3 text-sm text-indigo-200">
                Precision in every pixel of your inventory.
              </p>
            </div>

            <span className="inline-flex bg-yellow-400 text-black text-xs font-semibold px-4 py-2 rounded-lg">
              ⚠ Authorized Personnel Only
            </span>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#f4f6fb] p-10 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sign in to manage your stock and orders
            </p>

            {successMessage && (
              <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-md border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-md border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Secure Login →"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;