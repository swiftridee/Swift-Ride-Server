const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;
    console.log("Auth Headers:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found:", token);
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      console.log("Decoded token:", decoded);

      const user = await User.findById(decoded.id);
      if (!user) {
        console.log("No user found with decoded ID:", decoded.id);
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      console.log("User found:", user.email, "Role:", user.role);
      req.user = user;
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(
      "Checking role authorization. User role:",
      req.user.role,
      "Required roles:",
      roles
    );
    if (!roles.includes(req.user.role)) {
      console.log("Role not authorized");
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    console.log("Role authorized");
    next();
  };
};
