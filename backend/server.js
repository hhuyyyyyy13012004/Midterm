const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS cho Frontend gọi API
app.use(express.json()); // Parse JSON body

// Test route cơ bản
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const dataFile = path.join(__dirname, "products.json");

// Hàm đọc dữ liệu từ file JSON
const readData = () => {
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data);
};

// Hàm ghi dữ liệu vào file JSON
const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};
// GET: Lấy danh sách sản phẩm (Hỗ trợ query filter & search)
app.get("/products", (req, res) => {
  let products = readData();
  const { category, search } = req.query;

  // Xử lý Bonus: Filter theo category
  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Xử lý Bonus: Search theo tên sản phẩm
  if (search) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  res.json(products);
});
// GET: Lấy chi tiết 1 sản phẩm theo ID
app.get("/products/:id", (req, res) => {
  const products = readData();
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  }

  res.json(product);
});
// POST: Thêm sản phẩm mới
app.post("/products", (req, res) => {
  const { name, category, price, image, stock } = req.body;

  // Validate: Không được thiếu field
  if (
    !name ||
    !category ||
    price === undefined ||
    !image ||
    stock === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp đầy đủ thông tin sản phẩm" });
  }

  // Validate: price > 0 và stock >= 0
  if (Number(price) <= 0) {
    return res.status(400).json({ error: "Giá sản phẩm phải lớn hơn 0" });
  }
  if (Number(stock) < 0) {
    return res.status(400).json({ error: "Số lượng tồn kho không được âm" });
  }

  const products = readData();

  // Tạo ID tự động tăng
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const newProduct = {
    id: newId,
    name,
    category,
    price: Number(price),
    image,
    stock: Number(stock),
  };

  // Thêm vào mảng và ghi đè lại file JSON
  products.push(newProduct);
  writeData(products);

  res.status(201).json(newProduct);
});

// PUT: Cập nhật sản phẩm
app.put("/products/:id", (req, res) => {
  const products = readData();
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  // Nếu không tìm thấy sản phẩm -> trả về 404
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Không tìm thấy sản phẩm để cập nhật" });
  }

  // Lấy dữ liệu mới từ body (chỉ cập nhật những trường được gửi lên)
  const { name, category, price, image, stock } = req.body;

  // Validate cơ bản nếu có gửi price hoặc stock lên
  if (price !== undefined && Number(price) <= 0) {
    return res.status(400).json({ error: "Giá sản phẩm phải lớn hơn 0" });
  }
  if (stock !== undefined && Number(stock) < 0) {
    return res.status(400).json({ error: "Số lượng tồn kho không được âm" });
  }

  // Cập nhật dữ liệu
  const updatedProduct = {
    ...products[index], // Giữ lại các thông tin cũ
    name: name || products[index].name,
    category: category || products[index].category,
    price: price !== undefined ? Number(price) : products[index].price,
    image: image || products[index].image,
    stock: stock !== undefined ? Number(stock) : products[index].stock,
  };

  products[index] = updatedProduct;
  writeData(products); // Ghi lại vào file JSON

  res.json(updatedProduct);
});

// DELETE: Xóa sản phẩm
app.delete("/products/:id", (req, res) => {
  const products = readData();
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  // Nếu không tìm thấy sản phẩm -> 404
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
  }

  // Xóa sản phẩm khỏi mảng
  products.splice(index, 1);
  writeData(products); // Ghi lại mảng mới vào file JSON

  res.json({ message: "Xóa sản phẩm thành công", id: productId });
});

// Lắng nghe port
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
