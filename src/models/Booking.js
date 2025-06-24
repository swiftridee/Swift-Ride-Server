const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    rentalPlan: {
      name: String,
      duration: Number,
      price: Number,
    },
    includeDriver: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    sharedRide: {
      enabled: {
        type: Boolean,
        default: false,
      },
      riderInfo: {
        name: String,
        phone: String,
        email: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update status to completed when endDate is passed
bookingSchema.pre("save", function (next) {
  if (this.endDate < new Date() && this.status !== "cancelled") {
    this.status = "completed";
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
