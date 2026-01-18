import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react";

import {
  fetchAdminProducts,
  deleteAdminProduct,
  createAdminProduct
} from "../../api/adminProductApi";

import { uploadImagesToCloudinary } from "../../utils/cloudinaryUpload";
import EditProductModal from "../../components/admin/EditProductModal";

/* ================= CONSTANTS ================= */
const ITEMS_PER_PAGE = 10;
const LOW_STOCK_LIMIT = 5;

/* ================= COMPONENT ================= */
const AdminProducts = () => {
  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* FILTERS (READY FOR SCALE) */
  const [search] = useState("");
  const [category] = useState("");
  const [sort] = useState("");
  const [page, setPage] = useState(1);

  /* ADD PRODUCT MODAL */
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  /* EDIT PRODUCT MODAL */
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminProducts({
        search,
        category,
        sort,
        page,
        limit: ITEMS_PER_PAGE
      });

      setProducts(res.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  /* ================= DELETE PRODUCT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await deleteAdminProduct(id);
      loadProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  /* ================= CREATE PRODUCT ================= */
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = imageFiles.length
        ? await uploadImagesToCloudinary(imageFiles)
        : [];

      const form = e.target;

      const productData = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        price: Number(form.price.value),
        category: form.category.value.trim(),
        brand: form.brand.value.trim(),
        stock: Number(form.stock.value),
        images: uploadedImages
      };

      console.log("Creating product with data:", productData);
      const response = await createAdminProduct(productData);
      console.log("Product created successfully:", response);

      setShowAddModal(false);
      setImageFiles([]);
      setPreviewImages([]);
      alert("Product added successfully!");
      loadProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(error.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product Management
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map(product => {
                const isLowStock =
                  product.stock > 0 &&
                  product.stock <= LOW_STOCK_LIMIT;

                return (
                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 flex gap-3 items-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            className="w-full h-full object-cover"
                            alt={product.name}
                          />
                        ) : (
                          <ImageIcon className="text-gray-400" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>

                        {isLowStock && (
                          <p className="text-xs text-red-600 flex gap-1 items-center">
                            <AlertTriangle size={12} />
                            Low stock
                          </p>
                        )}
                      </div>
                    </td>

                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>

                    <td className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit product"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSuccess={loadProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;