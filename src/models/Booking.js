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
    emailSent: {
      type: Boolean,
      default: false,
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
    paymentInfo: {
      paymentMethod: {
        type: String,
        enum: ["credit", "paypal", "cod"],
        required: true,
      },
      cardName: {
        type: String,
        trim: true,
      },
      maskedCardNumber: {
        type: String,
        trim: true,
      },
      expiryDate: {
        type: String,
        trim: true,
      },
      saveCard: {
        type: Boolean,
        default: false,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "completed",
      },
      payment: {
        type: String,
        defualt: "0",
      },
      transactionId: {
        type: String,
        trim: true,
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
