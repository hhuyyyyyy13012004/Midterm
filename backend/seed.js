const mongoose = require("mongoose");
const Product = require("./models/Product"); // Đường dẫn đến Model của bạn

const seedData = [
  {
    name: "iPhone 15",
    price: 1000,
    category: "Phone",
    stock: 10,
    image: "...",
  },
  {
    name: "Macbook Pro",
    price: 2000,
    category: "Laptop",
    stock: 5,
    image: "...",
  },
];

const seedDB = async () => {
  await Product.deleteMany({}); // Xóa hết cái cũ (nếu muốn)
  await Product.insertMany(seedData);
  console.log("Dữ liệu mẫu đã được nạp thành công!");
  process.exit();
};

// Gọi hàm kết nối DB rồi chạy seedDB()
