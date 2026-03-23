import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là Edit, không có thì là Add
  const isEditMode = Boolean(id);

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nếu là chế độ Edit, gọi API lấy dữ liệu cũ điền vào form
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError("Không thể tải dữ liệu sản phẩm để sửa.");
          console.error(err);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  // Hàm bắt sự kiện khi gõ vào các ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi bấm nút Submit (Lưu)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang
    setLoading(true);
    setError(null);

    // Ép kiểu dữ liệu trước khi gửi lên Backend
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (isEditMode) {
        // Gọi API PUT để cập nhật
        await api.put(`/products/${id}`, payload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Gọi API POST để thêm mới
        await api.post("/products", payload);
        alert("Thêm sản phẩm thành công!");
      }
      // Thành công thì tự động quay về trang chủ
      navigate("/");
    } catch (err) {
      // Bắt lỗi từ Backend gửi về (ví dụ lỗi validate)
      const errorMessage =
        err.response?.data?.error || "Có lỗi xảy ra khi lưu sản phẩm.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      {error && (
        <div style={{ color: "red", marginBottom: "15px", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label style={{ fontWeight: "bold" }}>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Danh mục:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Giá ($):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="1"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Link ảnh (URL):</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Số lượng tồn kho:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>

          <Link
            to="/"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
