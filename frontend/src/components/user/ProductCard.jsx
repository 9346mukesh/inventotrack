import { ShoppingCart, Heart, Star } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-400 text-sm">No image</p>
            </div>
          </div>
        )}

        {/* BADGE */}
        <div className="absolute top-3 right-3 flex gap-2">
          {product.stock === 0 ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Low Stock
            </span>
          ) : null}
        </div>

        {/* WISHLIST BUTTON */}
        <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all group-hover:scale-110">
          <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 flex flex-col">
        {/* RATING */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-gray-700">4.8</span>
          <span className="text-xs text-gray-500">(120)</span>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
          {product.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
          {product.description || "Premium quality product"}
        </p>

        {/* PRICE */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-indigo-600">
            ₹{product.price?.toLocaleString()}
          </p>
          <p className={`text-xs font-medium mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>

        {/* BUTTON */}
        <button
          disabled={product.stock === 0}
          onClick={() => onAddToCart(product)}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            product.stock === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg active:scale-95"
          }`}
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;