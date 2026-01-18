import { X } from "lucide-react";
import { useState } from "react";
import { createAdminProduct } from "../../api/adminProductApi";

const AddProductModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    images: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAdminProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          ? form.images.split(",").map(i => i.trim())
          : []
      });

      onSuccess(); // reload products
      onClose();   // close modal
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Product Name"
            className="input"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category (e.g. Mobile)"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="brand"
            placeholder="Brand"
            className="input"
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Initial Stock"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="images"
            placeholder="Image URLs (comma separated)"
            className="input"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;