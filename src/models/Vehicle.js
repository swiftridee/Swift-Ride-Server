const mongoose = require("mongoose");

const rentalPlanSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: [true, "Base price (12-hour rate) is required"],
    min: [0, "Base price must be positive"],
  },
  driverFeeEnabled: {
    type: Boolean,
    default: true,
  },
});

const PUNJAB_CITIES = [
  "Lahore",
  "Faisalabad",
  "Rawalpindi",
  "Multan",
  "Gujranwala",
  "Sialkot",
  "Bahawalpur",
  "Sargodha",
  "Sahiwal",
  "Jhang",
  "Sheikhupura",
  "Kasur",
];

const VEHICLE_FEATURES = [
  "Sunroof",
  "Leather Seats",
  "GPS Navigation",
  "Bluetooth",
  "Child Seat",
  "Heated Seats",
  "Reverse Camera",
  "Air Conditioning",
  "Cruise Control",
];

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide vehicle name"],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, "Please provide brand name"],
      trim: true,
      index: true,
    },
    vehicleType: {
      type: String,
      required: [true, "Please provide vehicle type"],
      enum: ["Car", "Mini Bus", "Bus", "Coaster"],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Please provide vehicle location"],
      enum: PUNJAB_CITIES,
      index: true,
    },
    seats: {
      type: Number,
      required: [true, "Please provide number of seats"],
      min: [1, "Number of seats must be at least 1"],
    },
    features: [
      {
        type: String,
        enum: VEHICLE_FEATURES,
      },
    ],
    image: {
      type: String,
      required: [true, "Please provide vehicle image"],
    },
    rentalPlan: rentalPlanSchema,
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for common query patterns
vehicleSchema.index({ status: 1, vehicleType: 1 });
vehicleSchema.index({ brand: 1, status: 1 });
vehicleSchema.index({ location: 1, status: 1 });
vehicleSchema.index({ createdAt: -1 });

// Export constants for use in the frontend
vehicleSchema.statics.PUNJAB_CITIES = PUNJAB_CITIES;
vehicleSchema.statics.VEHICLE_FEATURES = VEHICLE_FEATURES;

// Helper method to calculate rental price for a given duration
vehicleSchema.methods.calculateRentalPrice = function (
  hours,
  includeDriver = false
) {
  const basePrice = this.rentalPlan.basePrice;
  const driverFee =
    includeDriver && this.rentalPlan.driverFeeEnabled ? 2000 : 0;
  const numberOfBaseUnits = Math.ceil(hours / 12);
  return (basePrice + driverFee) * numberOfBaseUnits;
};

module.exports = mongoose.model("Vehicle", vehicleSchema);
