import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";

/* ================= CONSTANTS ================= */
const LOW_STOCK_LIMIT = 5;

/* ================= COMPONENT ================= */
const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD INVENTORY ================= */
  const loadInventory = async () => {
    try {
      // ✅ Admin should always use admin-secured routes
      const res = await api.get("/admin/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  /* ================= INVENTORY STATS ================= */
  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock > LOW_STOCK_LIMIT).length;
  const lowStock = products.filter(
    p => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <p className="text-gray-500">
          Monitor product stock levels in real time
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          color="blue"
        />
        <StatCard
          title="In Stock"
          value={inStock}
          color="green"
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          color="yellow"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          color="red"
        />
      </div>

      {/* ================= INVENTORY TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4">Product</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  No inventory data found
                </td>
              </tr>
            ) : (
              products.map(product => {
                const isLow =
                  product.stock > 0 &&
                  product.stock <= LOW_STOCK_LIMIT;
                const isOut = product.stock === 0;

                return (
                  <tr
                    key={product._id}
                    className={`border-t ${
                      isOut
                        ? "bg-red-50"
                        : isLow
                        ? "bg-amber-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      {isOut ? (
                        <span className="text-red-600 font-semibold">
                          ❌ Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-amber-600 font-semibold">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">
                          ✅ In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;