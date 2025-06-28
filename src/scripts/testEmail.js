const emailService = require("../utils/emailService");
const config = require("../config/config");

const testBooking = {
  _id: "TEST-123",
  startDate: new Date(),
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  vehicle: {
    brand: "BMW",
    name: "3 Series",
  },
  pickupLocation: "Lahore",
  dropLocation: "Rawalpindi",
  price: 180000,
};

const testUser = {
  name: "Email Test",
  email: "usmanbaig1573@gmail.com", // Using your email for testing
};

async function testEmailService() {
  console.log("Starting email service test...");
  console.log("Email Configuration:", {
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    user: config.EMAIL_USER,
    from: config.EMAIL_FROM,
  });

  try {
    console.log("Attempting to send test email to:", testUser.email);
    const result = await emailService.sendBookingConfirmation(
      testBooking,
      testUser
    );

    if (result) {
      console.log("✅ Email test successful! Check your inbox.");
    } else {
      console.log("❌ Email test failed. Check the error logs above.");
    }
  } catch (error) {
    console.error("Test failed with error:", error);
    console.error("Stack trace:", error.stack);
  }
}

testEmailService();
