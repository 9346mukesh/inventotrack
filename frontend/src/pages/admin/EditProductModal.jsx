import { useState } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";

import { updateAdminProduct } from "../../api/adminProductApi";
import { uploadImagesToCloudinary } from "../../utils/cloudinaryUpload";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category || "",
    brand: product.brand || "",
    stock: product.stock || ""
  });

  const [existingImages, setExistingImages] = useState(
    product.images || []
  );
  const [newImages, setNewImages] = useState([]);
  const [previewNewImages, setPreviewNewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= IMAGE HANDLERS ================= */

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Each image must be under 2MB");
        return;
      }
    }

    setNewImages(files);
    setPreviewNewImages(files.map(file => URL.createObjectURL(file)));
    setError("");
  };

  const removeExistingImage = (img) => {
    setExistingImages(prev => prev.filter(i => i !== img));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.name || !form.price || !form.category) {
        throw new Error("Required fields missing");
      }

      // Upload new images (if any)
      const uploadedNewImages = newImages.length
        ? await uploadImagesToCloudinary(newImages)
        : [];

      const updatedProduct = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...existingImages, ...uploadedNewImages]
      };

      await updateAdminProduct(product._id, updatedProduct);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product Name"
            className="border p-2 rounded"
          />
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="Brand"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            className="border p-2 rounded"
          />
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
            className="border p-2 rounded col-span-2"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
            className="border p-2 rounded col-span-2"
            rows={3}
          />
        </div>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Existing Images</p>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <button
                    onClick={() => removeExistingImage(img)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPLOAD NEW IMAGES */}
        <label className="mt-4 flex items-center gap-2 cursor-pointer text-indigo-600">
          <Upload size={18} />
          Upload New Images
          <input
            type="file"
            multiple
            hidden
            onChange={handleNewImages}
          />
        </label>

        {/* PREVIEW NEW */}
        <div className="flex gap-2 mt-3">
          {previewNewImages.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-16 h-16 rounded object-cover border"
            />
          ))}
        </div>

        {/* ACTION */}
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