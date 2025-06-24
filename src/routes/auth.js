const express = require("express");
const router = express.Router();
const {
  adminLogin,
  register,
  login,
} = require("../controllers/authController");

// User routes
router.post("/register", register);
router.post("/login", login);

// Admin routes
router.post("/admin/login", adminLogin);

module.exports = router;
