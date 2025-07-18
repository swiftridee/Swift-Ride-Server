const express = require("express");
const router = express.Router();
const {
  adminLogin,
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateProfile,
  getCurrentUser,
  contactUs,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// User routes
router.post("/register", register);
router.post("/login", login);

// Update User
router.put("/profile", updateProfile);
router.get("/profile/:id", getCurrentUser);
// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
// Contact Us route
router.post("/contact", contactUs);
// Admin routes
router.post("/admin/login", adminLogin);

// Update password (protected)
router.put("/update-password", protect, updatePassword);

module.exports = router;
