# 🛒 HUTECH Store - Product Management System

A comprehensive product management project. This system supports full CRUD operations, real-time search, category filtering, and a modern UI with smooth page transitions.

## 🌟 Key Features

- **Product Management:** Create, Read (View Details), Update, and Delete products.
- **Real-time Database:** Directly connected to **MongoDB** (replacing static JSON files).
- **Smart Filtering:** \* Search by name with **Debounce** (prevents flickering/lag).
  - Filter by **Category** (e.g., Laptop, Phone).
- **Modern UI/UX:**
  - Designed with **Tailwind CSS** for a fully responsive layout (Mobile/Desktop).
  - Smooth **Page Transitions** powered by **Framer Motion**.
  - Professional **Loading** states and **Error Handling**.
- **Security:** Environment variables managed via `.env` files.

---

## 🛠 Tech Stack

### Frontend

- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animation)
- **Axios** (HTTP Client)
- **React Router Dom** (Navigation)

### Backend

- **Node.js & Express.js**
- **Mongoose** (ODM for MongoDB)
- **Dotenv** (Security)
- **Cors** (Cross-Origin Resource Sharing)

---

## 📁 Project Structure

```text
HUTECH_STORE/
├── backend/
│   ├── server.js         # Server entry point
│   ├── .env              # Environment variables (DB URI, Port)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # ProductList, ProductForm, ProductDetail, AnimatedPage...
│   │   ├── api.js        # Axios configuration
│   │   ├── App.jsx       # Route management
│   │   └── index.css     # Tailwind Directives
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Prerequisites

- **Node.js** installed on your machine.
- **MongoDB** running (Local instance or MongoDB Atlas).

### 2. Backend Configuration

```bash
cd backend
npm install
# Create a .env file and add the following:
# MONGO_URI=mongodb://127.0.0.1:27017/product_management
# PORT=5000
npm run dev
```

### 3. Frontend Configuration

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: `http://localhost:5174`

---

## 👤 Author Information

- **Full Name:** Nguyễn Hoàng Huy
- **Student ID:** 2280601179
- **University:** Ho Chi Minh City University of Technology (HUTECH)
- **Major:** Software Engineering

---

### 📝 Technical Highlights for Presentation

- **Input Focus Fix:** Solved the "input losing focus" bug during re-renders by decoupling the search state from the global loading conditional.
- **Navigation Reset:** Utilized the `useLocation` hook to detect home navigation and automatically reset filter states for a consistent UX.
- **Data Normalization:** Configured Mongoose Schema with `toJSON transform` to map MongoDB `_id` to a clean `id` field for frontend compatibility.
