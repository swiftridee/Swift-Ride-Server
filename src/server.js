const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/bookings");
const vehicleRoutes = require("./routes/vehicles");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
// Increase payload size limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Welcome route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to SwiftRide API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check route for Vercel
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Test route to check if API is working
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);

// 404 handler
app.use((req, res) => {
  console.log("404 Not Found:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "/",
      "/api/health",
      "/api/test",
      "/api/auth/*",
      "/api/admin/*",
      "/api/bookings/*",
      "/api/vehicles/*"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.set("debug", process.env.NODE_ENV !== "production"); // Enable mongoose debug mode only in development
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    const PORT = config.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Available routes:");
      console.log("- /");
      console.log("- /api/health");
      console.log("- /api/test");
      console.log("- /api/auth/*");
      console.log("- /api/admin/*");
      console.log("- /api/bookings/*");
      console.log("- /api/vehicles/*");
    });
  });
} else {
  // For Vercel serverless environment
  connectDB();
}

module.exports = app;
