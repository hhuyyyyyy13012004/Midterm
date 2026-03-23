import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import AnimatedPage from "./AnimatedPage";

function ProductList() {
  const location = useLocation(); // Dùng để theo dõi URL thay đổi
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // 1. LOGIC RESET: Khi nhấn vào Logo hoặc trang chủ (URL là / không có query), xóa sạch search
  useEffect(() => {
    if (location.pathname === "/" && !location.search) {
      setSearchTerm("");
      setCategoryFilter("");
    }
  }, [location]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: { search: searchTerm, category: categoryFilter },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Lỗi kết nối Backend.");
    } finally {
      setLoading(false);
    }
  };

  // 2. DEBOUNCE: Đợi người dùng gõ xong 300ms mới gọi API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8">
          Danh sách sản phẩm
        </h2>

        {/* 3. THANH TÌM KIẾM CỐ ĐỊNH: Đặt ở đây để không bị re-mount làm mất focus */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-gray-600"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
          </select>
        </div>

        {/* 4. PHẦN NỘI DUNG THAY ĐỔI THEO TRẠNG THÁI */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse text-xl">
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner text-gray-400 border border-dashed">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="h-52 overflow-hidden bg-gray-50 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-1 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-blue-600">
                      ${product.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter ${
                        product.stock > 0
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      Kho: {product.stock}
                    </span>
                  </div>

                  {/* CỤM NÚT BẤM ĐỒNG BỘ */}
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 text-center py-2.5 rounded-xl border border-blue-100 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      Xem
                    </Link>

                    <Link
                      to={`/edit/${product.id}`}
                      className="flex-1 text-center py-2.5 rounded-xl border border-emerald-100 text-emerald-600 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      Sửa
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
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
    </AnimatedPage>
  );
}

export default ProductList;
