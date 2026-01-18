import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/productApi";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      loadProducts();
    }, 300); // 🔥 debounce search

    return () => clearTimeout(delay);
  }, [search, category, sort]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        search,
        category,
        sort
      });
      setProducts(res.products || []);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop Products</h1>
              <p className="text-gray-600 mt-1">Discover our amazing collection of products</p>
            </div>

            {/* 🔍 SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* FILTERS SIDEBAR - DESKTOP */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                {(category || sort) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* CATEGORY FILTER */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 transition-all"
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* SORT FILTER */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sort By
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 transition-all"
                  >
                    <option value="">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS MODAL - MOBILE */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
              <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl overflow-y-auto animate-slideIn">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                      >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Sort By
                      </label>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                      >
                        <option value="">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS SECTION */}
          <div className="flex-1 min-w-0">
            {/* FILTERS TOGGLE - MOBILE */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <SlidersHorizontal size={20} />
              <span>Filters & Sort</span>
            </button>

            {/* LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && products.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      to={`/products/${product._id}`}
                      key={product._id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-gray-400 mb-2">📦</div>
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Low Stock
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>

                        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-indigo-600">
                              ₹{product.price?.toLocaleString()}
                            </p>
                            <p className={`text-xs font-medium mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white group-hover:shadow-lg transition-shadow">
                            →
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;