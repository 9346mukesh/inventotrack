import { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadImagesToCloudinary } from "../../utils/cloudinaryUpload";
import { updateAdminProduct } from "../../api/adminProductApi";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category || "",
    brand: product.brand || "",
    stock: product.stock || ""
  });

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(product.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* HANDLE IMAGE UPLOAD */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setNewImages(files);
    setError("");
  };

  /* SUBMIT UPDATE */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const uploadedImages = newImages.length
        ? await uploadImagesToCloudinary(newImages)
        : [];

      await updateAdminProduct(product._id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...previewImages, ...uploadedImages]
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
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
            className="border p-2 rounded"
            value={form.name}
            placeholder="Product Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            value={form.brand}
            placeholder="Brand"
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 rounded"
            value={form.price}
            placeholder="Price"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 rounded"
            value={form.stock}
            placeholder="Stock"
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <input
            className="border p-2 rounded col-span-2"
            value={form.category}
            placeholder="Category"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <textarea
            className="border p-2 rounded col-span-2"
            rows={3}
            value={form.description}
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* IMAGE UPLOAD */}
        <label className="mt-4 flex items-center gap-2 cursor-pointer text-indigo-600">
          <Upload size={18} />
          Upload new images
          <input
            type="file"
            multiple
            hidden
            onChange={handleImages}
          />
        </label>

        {/* IMAGE PREVIEW */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {previewImages.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-16 h-16 rounded object-cover border"
            />
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <button
          onClick={handleSubmit}
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