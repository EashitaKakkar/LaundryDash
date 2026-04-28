require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const orderRoutes = require("./routes/orderRoutes");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Middlewares (Must be BEFORE routes)
app.use(express.json());
app.use(cors());

// 2. Public Routes
app.use("/api/auth", authRoutes);

// 3. Protected Routes
// Ensure authMiddleware is working correctly!
app.use("/api/orders", authMiddleware, orderRoutes);

// 4. Base Route for Testing
app.get("/", (req, res) => res.send("Laundry API is Live"));

// 5. Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/laundryDB";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000; // Use Render's port or 5000
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Error:", err));