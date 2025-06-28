require("dotenv").config();

module.exports = {
  // PORT: process.env.PORT,
  // MONGODB_URI: process.env.MONGODB_URI,
  // JWT_SECRET: process.env.JWT_SECRET,
  // JWT_EXPIRE: process.env.JWT_EXPIRE,
  // ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  // ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  // EMAIL_HOST: process.env.EMAIL_HOST,
  // EMAIL_PORT: process.env.EMAIL_PORT,
  // EMAIL_USER: process.env.EMAIL_USER,
  // EMAIL_PASS: process.env.EMAIL_PASS,
  // EMAIL_FROM: process.env.EMAIL_FROM,
  PORT: 5000,
  MONGODB_URI:
    "mongodb+srv://usmanbaig1573:Password@cluster1.flxilna.mongodb.net/swift-ride",
  JWT_SECRET: "your-secret-key",
  JWT_EXPIRE: "24h",
  ADMIN_EMAIL: "admin@swiftride.com",
  ADMIN_PASSWORD: "admin123",
  EMAIL_HOST: "smtp.gmail.com",
  EMAIL_PORT: 587,
  EMAIL_USER: "your-email@gmail.com",
  EMAIL_PASS: "your-app-specific-password (16 characters)",
  EMAIL_FROM: "Swift Ride <your-email@gmail.com>",
};
