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
        message: "Not authorized to access this route - No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      console.log("Decoded token:", decoded);

      if (!decoded.id) {
        console.log("Token missing user ID");
        return res.status(401).json({
          success: false,
          message: "Invalid token format",
        });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        console.log("No user found with decoded ID:", decoded.id);
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      // Check if user is active
      if (user.status === "blocked") {
        console.log("User is blocked:", user.email);
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked. Please contact support.",
        });
      }

      console.log("User found:", user.email, "Role:", user.role);
      req.user = user;
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error in authentication",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

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
        message: `User role ${req.user.role} is not authorized to access this route. Required roles: ${roles.join(", ")}`,
      });
    }
    console.log("Role authorized");
    next();
  };
};
