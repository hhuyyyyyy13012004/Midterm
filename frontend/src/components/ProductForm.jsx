import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";
import AnimatedPage from "./AnimatedPage"; // <-- Import component hiệu ứng

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      api
        .get(`/products/${id}`)
        .then((res) => setFormData(res.data))
        .catch(console.error);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      isEditMode
        ? await api.put(`/products/${id}`, payload)
        : await api.post("/products", payload);
      navigate("/");
    } catch (err) {
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      {" "}
      {/* <-- Bọc toàn bộ nội dung Form */}
      <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">
          {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              label: "Tên sản phẩm",
              name: "name",
              type: "text",
              placeholder: "VD: iPhone 15 Pro",
            },
            {
              label: "Danh mục",
              name: "category",
              type: "text",
              placeholder: "Phone, Laptop...",
            },
            {
              label: "Giá ($)",
              name: "price",
              type: "number",
              placeholder: "0",
            },
            {
              label: "Link ảnh",
              name: "image",
              type: "text",
              placeholder: "https://...",
            },
            {
              label: "Tồn kho",
              name: "stock",
              type: "number",
              placeholder: "0",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Lưu dữ liệu"}
            </button>
            <Link
              to="/"
              className="flex-1 text-center bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
}

export default ProductForm;
