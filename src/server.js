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
  console.log(`${req.method} ${req.path}`);
  next();
});

// Welcome route
app.get("/", (req, res) => {
  res.send("Server is running");
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
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// Connect to MongoDB
mongoose.set("debug", true); // Enable mongoose debug mode
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server only if in production, otherwise just log
    if (process.env.NODE_ENV === "production") {
      const PORT = config.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running in PRODUCTION on port ${PORT}`);
      });
    } else {
      const PORT = config.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running in DEVELOPMENT on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
