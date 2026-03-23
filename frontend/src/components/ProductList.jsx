import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Yêu cầu: Có loading state
  const [error, setError] = useState(null); // Yêu cầu: Có error handling

  // State cho phần Bonus: Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Hàm gọi API lấy danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/products", {
        params: { search: searchTerm, category: categoryFilter },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng kiểm tra lại Backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect tự động chạy lại fetchProducts mỗi khi ô search hoặc filter thay đổi giá trị
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Thêm delay nhỏ để tránh gọi API liên tục khi gõ phím
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryFilter]);

  // Hàm xử lý Xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await api.delete(`/products/${id}`);
        // Xóa thành công trên DB (file json) thì load lại danh sách trên UI
        fetchProducts();
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  // 1. Hiển thị lúc đang chờ dữ liệu
  if (loading) return <div>Đang tải dữ liệu... ⏳</div>;

  // 2. Hiển thị lúc có lỗi mạng/server
  if (error)
    return <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>;

  // 3. Hiển thị giao diện chính khi đã có dữ liệu
  return (
    <div>
      <h2>Danh sách sản phẩm</h2>

      {/* Phần Bonus: Search & Filter */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            flex: 1,
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Tất cả danh mục</option>
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
        </select>
      </div>

      {/* Render Danh sách */}
      {products.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>
                <p style={{ margin: "5px 0" }}>
                  Danh mục: <strong>{product.category}</strong>
                </p>
                <p style={{ margin: "5px 0" }}>
                  Giá: <strong>${product.price}</strong>
                </p>
                <p style={{ margin: "5px 0" }}>
                  Tồn kho: <strong>{product.stock}</strong>
                </p>

                {/* Các nút chức năng */}
                <div
                  style={{ marginTop: "15px", display: "flex", gap: "10px" }}
                >
                  <Link to={`/product/${product.id}`}>
                    <button style={{ padding: "5px 10px", cursor: "pointer" }}>
                      Xem chi tiết
                    </button>
                  </Link>
                  <Link to={`/edit/${product.id}`}>
                    <button style={{ padding: "5px 10px", cursor: "pointer" }}>
                      Sửa
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
