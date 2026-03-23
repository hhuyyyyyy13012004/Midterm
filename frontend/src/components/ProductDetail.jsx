import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import AnimatedPage from "./AnimatedPage"; // <-- Nhập component hiệu ứng

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading)
    return (
      <AnimatedPage>
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Đang tải...
        </div>
      </AnimatedPage>
    );

  if (!product)
    return (
      <AnimatedPage>
        <div className="text-center py-20 text-red-500">
          Sản phẩm không tồn tại.
        </div>
      </AnimatedPage>
    );

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Cột Trái: Ảnh */}
          <div className="md:w-1/2 h-96 md:h-auto overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            />
          </div>

          {/* Cột Phải: Thông tin */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2">
              {product.category}
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.stock > 0
                  ? `Còn ${product.stock} sản phẩm`
                  : "Hết hàng"}
              </span>
            </div>

            <div className="space-y-4 border-t pt-6">
              <Link
                to={`/edit/${product.id}`}
                className="block w-full text-center bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Chỉnh sửa thông tin
              </Link>
              <Link
                to="/"
                className="block w-full text-center text-gray-500 font-medium py-2 hover:text-gray-800 transition-colors"
              >
                ⬅ Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default ProductDetail;
