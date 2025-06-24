const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { validateVehicle } = require("../middleware/validation");
const {
  getDashboardStats,
  getBookings,
  updateBookingStatus,
  getUsers,
  updateUserStatus,
  getAnalytics,
  getStats,
} = require("../controllers/adminController");
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// Protect all routes
router.use(protect);
router.use(authorize("admin"));

// Stats route
router.get("/stats", getStats);

// Dashboard routes
router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

// Booking routes
router.get("/bookings", getBookings);
router.put("/bookings/:id", updateBookingStatus);

// User routes
router.get("/users", getUsers);
router.put("/users/:id", updateUserStatus);

// Vehicle routes
router.get("/vehicles", getVehicles);
router.post("/vehicles", validateVehicle, createVehicle);
router.get("/vehicles/:id", getVehicle);
router.put("/vehicles/:id", validateVehicle, updateVehicle);
router.delete("/vehicles/:id", deleteVehicle);

module.exports = router;
