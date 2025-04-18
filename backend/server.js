require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
// In backend/server.js
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://127.0.0.1:5173",
        ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to RecipeHub API",
    endpoints: {
      test: "/api/test",
      auth: "/api/auth",
      recipes: "/api/recipes",
      bookmarks: "/api/bookmarks",
      ai: "/api/ai",
    },
  });
});

// Test route to verify server is running
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something broke!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api/test`);
});
