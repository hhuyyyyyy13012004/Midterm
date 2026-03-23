import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function ProductDetail() {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm gọi API lấy chi tiết 1 sản phẩm
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra từ Backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Xử lý các trạng thái hiển thị (Loading, Error)
  if (loading) return <div>Đang tải thông tin chi tiết... ⏳</div>;
  if (error)
    return <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>;
  if (!product) return <div>Không có dữ liệu.</div>;

  // Render giao diện chi tiết
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Chi tiết sản phẩm</h2>

      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
          marginBottom: "15px",
          objectFit: "cover",
        }}
      />

      <h3>{product.name}</h3>
      <p style={{ fontSize: "16px" }}>
        <strong>Danh mục:</strong> {product.category}
      </p>
      <p style={{ fontSize: "16px", color: "#28a745" }}>
        <strong>Giá:</strong> ${product.price}
      </p>
      <p style={{ fontSize: "16px" }}>
        <strong>Số lượng tồn kho:</strong> {product.stock}
      </p>

      {/* Nút điều hướng */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#007bff",
            border: "1px solid #007bff",
            padding: "8px 15px",
            borderRadius: "4px",
          }}
        >
          ⬅ Quay lại danh sách
        </Link>
        <Link
          to={`/edit/${product.id}`}
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#ffc107",
            padding: "8px 15px",
            borderRadius: "4px",
          }}
        >
          Sửa sản phẩm
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;
