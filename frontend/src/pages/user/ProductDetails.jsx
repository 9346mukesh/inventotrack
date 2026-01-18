import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProductById } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Heart, Share2, ShoppingCart, Truck, RotateCcw } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setAddingToCart(false);
      // Show success feedback
      alert("Product added to cart!");
    } catch (err) {
      console.error(err);
      setAddingToCart(false);
      alert("Failed to add to cart");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">⚠️ {error || "Product not found"}</h2>
          <p className="text-gray-600 mb-6">The product you're looking for is no longer available</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* IMAGE SECTION */}
          <div className="space-y-4">
            {/* MAIN IMAGE */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-96 md:h-[500px] flex items-center justify-center">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-2">📦</div>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* THUMBNAIL IMAGES */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx
                        ? "border-indigo-600 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="space-y-6">
            {/* HEADER */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                  <Heart size={24} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              {/* CATEGORY & RATING */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {product.category || "General"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium text-gray-700">4.8 (320 reviews)</span>
                </div>
              </div>
            </div>

            {/* PRICE SECTION */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-4xl font-bold text-indigo-600">
                    ₹{product.price?.toLocaleString()}
                  </p>
                </div>
                {/* STOCK STATUS */}
                <div className="ml-auto">
                  {product.stock > 0 ? (
                    <div className="text-right">
                      <span className="inline-block px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-lg">
                        In Stock
                      </span>
                      <p className="text-xs text-gray-600 mt-1">{product.stock} available</p>
                    </div>
                  ) : (
                    <span className="inline-block px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About this product</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <Truck className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                <p className="text-xs font-medium text-gray-700">Free Delivery</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <RotateCcw className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <ShoppingCart className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                <p className="text-xs font-medium text-gray-700">Secure Checkout</p>
              </div>
            </div>

            {/* QUANTITY & ACTION */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stock > 0 ? `${product.stock - quantity} items left` : "Not available"}
                  </span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button className="flex-1 border-2 border-indigo-600 text-indigo-600 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700">
                    <Link to="/login" className="font-semibold hover:underline">
                      Login
                    </Link>{" "}
                    to add items to cart
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;