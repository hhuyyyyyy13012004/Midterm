import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Thanh điều hướng (Navbar) cơ bản */}
        <nav
          style={{
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Link
            to="/"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "blue",
              fontWeight: "bold",
            }}
          >
            Trang chủ
          </Link>
          <Link
            to="/add"
            style={{
              textDecoration: "none",
              color: "green",
              fontWeight: "bold",
            }}
          >
            + Thêm sản phẩm
          </Link>
        </nav>

        {/* Định tuyến các trang */}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
