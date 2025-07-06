const express = require("express");
const router = express.Router();
const {
  adminLogin,
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

// User routes
router.post("/register", register);
router.post("/login", login);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Admin routes
router.post("/admin/login", adminLogin);

module.exports = router;
