require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- 1. KẾT NỐI MONGODB ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/product_management";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Đã kết nối thành công với MongoDB!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- 2. TẠO MODEL SCHEMA ---
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id; // Đổi _id của MongoDB thành id cho Frontend dễ đọc
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Product = mongoose.model("Product", productSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend MongoDB is running!");
});

// --- 3. CÁC API ENDPOINTS ---

// GET: Lấy danh sách sản phẩm (Hỗ trợ query filter & search)
app.get("/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (search) query.name = new RegExp(search, "i");

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
  }
});

// GET: Lấy chi tiết 1 sản phẩm theo ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "ID sản phẩm không hợp lệ" });
  }
});

// POST: Thêm sản phẩm mới
app.post("/products", async (req, res) => {
  try {
    const { name, category, price, image, stock } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      !image ||
      stock === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
    }
    if (Number(price) <= 0)
      return res.status(400).json({ error: "Giá phải > 0" });
    if (Number(stock) < 0)
      return res.status(400).json({ error: "Tồn kho không được âm" });

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      image,
      stock: Number(stock),
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lưu sản phẩm vào database" });
  }
});

// PUT: Cập nhật sản phẩm bằng Mongoose
app.put("/products/:id", async (req, res) => {
  try {
    const { name, category, price, image, stock } = req.body;

    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({ error: "Giá sản phẩm phải lớn hơn 0" });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ error: "Số lượng tồn kho không được âm" });
    }

    // findByIdAndUpdate sẽ tìm và sửa thẳng trong Database
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, image, stock },
      { new: true }, // Trả về dữ liệu mới sau khi đã cập nhật
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy sản phẩm để cập nhật" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: "Lỗi cập nhật hoặc ID không hợp lệ" });
  }
});

// DELETE: Xóa sản phẩm bằng Mongoose
app.delete("/products/:id", async (req, res) => {
  try {
    // findByIdAndDelete sẽ tìm và xóa thẳng trong Database
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
    }

    res.json({ message: "Xóa sản phẩm thành công", id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi xóa hoặc ID không hợp lệ" });
  }
});

// Lắng nghe port
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
