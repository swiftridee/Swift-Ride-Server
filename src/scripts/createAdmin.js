const mongoose = require("mongoose");
const User = require("../models/User");
const config = require("../config/config");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      role: "admin",
      city: "Karachi",
      gender: "male",
      cnic: "42201-0000000-0",
    });

    console.log("Admin user created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
