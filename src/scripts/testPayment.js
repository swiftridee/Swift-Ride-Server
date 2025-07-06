const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const config = require("../config/config");

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testPaymentData = async () => {
  try {
    console.log("Testing payment data storage...");

    // Find a recent booking with payment info
    const booking = await Booking.findOne({
      "paymentInfo.paymentMethod": { $exists: true },
    })
      .populate("user", "name email")
      .populate("vehicle", "name brand");

    if (booking) {
      console.log("Found booking with payment info:");
      console.log("Booking ID:", booking._id);
      console.log("User:", booking.user.name);
      console.log("Vehicle:", booking.vehicle.name);
      console.log("Payment Method:", booking.paymentInfo.paymentMethod);
      console.log("Card Name:", booking.paymentInfo.cardName);
      console.log("Masked Card Number:", booking.paymentInfo.maskedCardNumber);
      console.log("Expiry Date:", booking.paymentInfo.expiryDate);
      console.log("Payment Status:", booking.paymentInfo.paymentStatus);
      console.log("Payment Date:", booking.paymentInfo.paymentDate);
      console.log("Save Card:", booking.paymentInfo.saveCard);
    } else {
      console.log("No bookings with payment info found yet.");
      console.log(
        "Create a booking through the frontend to test payment storage."
      );
    }

    // Get count of bookings with payment info
    const count = await Booking.countDocuments({
      "paymentInfo.paymentMethod": { $exists: true },
    });
    console.log(`Total bookings with payment info: ${count}`);
  } catch (error) {
    console.error("Error testing payment data:", error);
  } finally {
    mongoose.connection.close();
  }
};

testPaymentData();
