import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadImagesToCloudinary } from "../../utils/cloudinaryUpload";
import { updateAdminProduct } from "../../api/adminProductApi";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: ""
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* PREFILL FORM */
  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock || ""
    });

    setExistingImages(product.images || []);
    setPreview(product.images || []);
  }, [product]);

  /* IMAGE VALIDATION */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + existingImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Each image must be less than 2MB");
        return;
      }
    }

    setNewImages(files);
    setPreview([
      ...existingImages,
      ...files.map((f) => URL.createObjectURL(f))
    ]);
    setError("");
  };

  /* SUBMIT UPDATE */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (!form.name || !form.price || !form.category) {
        throw new Error("Required fields missing");
      }

      const uploadedImages = newImages.length
        ? await uploadImagesToCloudinary(newImages)
        : [];

      await updateAdminProduct(product._id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...existingImages, ...uploadedImages]
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <input
            value={form.name}
            placeholder="Product Name"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            value={form.brand}
            placeholder="Brand"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
          />

          <input
            value={form.price}
            placeholder="Price"
            type="number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            value={form.stock}
            placeholder="Stock"
            type="number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <input
            value={form.category}
            placeholder="Category"
            className="border p-2 rounded col-span-2"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <textarea
            value={form.description}
            placeholder="Description"
            className="border p-2 rounded col-span-2"
            rows={3}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* IMAGE UPLOAD */}
        <label className="mt-4 flex items-center gap-2 cursor-pointer text-indigo-600">
          <Upload size={18} />
          Upload Images (max 5)
          <input
            type="file"
            multiple
            hidden
            onChange={handleImages}
          />
        </label>

        {/* PREVIEW */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-16 h-16 rounded object-cover border"
              alt="preview"
            />
          ))}
        </div>

        {/* ACTIONS */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold flex justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" />}
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProductModal;