require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://usmanbaig1573:Password@cluster1.flxilna.mongodb.net/swift-ride",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "24h",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@swiftride.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
};
