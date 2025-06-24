const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      includeDriver,
      pickupLocation,
      dropLocation,
      notes,
      sharedRide,
    } = req.body;

    console.log("Creating booking with data:", {
      vehicleId,
      startDate,
      endDate,
      includeDriver,
      pickupLocation,
      dropLocation,
      notes,
      sharedRide,
    });

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date",
      });
    }

    // Calculate duration in hours
    const durationInHours = Math.ceil((end - start) / (1000 * 60 * 60));
    if (durationInHours < 12) {
      return res.status(400).json({
        success: false,
        error: "Minimum booking duration is 12 hours",
      });
    }

    // Get vehicle and calculate price
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    // Check if vehicle is available
    if (vehicle.status !== "Available") {
      return res.status(400).json({
        success: false,
        error: "Vehicle is not available for booking",
      });
    }

    // Calculate total price using the vehicle's calculateRentalPrice method
    const totalPrice = vehicle.calculateRentalPrice(
      durationInHours,
      includeDriver
    );

    console.log("Creating booking with user:", req.user._id);

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      includeDriver,
      price: totalPrice,
      status: "pending",
      pickupLocation,
      dropLocation,
      notes,
      sharedRide: sharedRide
        ? {
            enabled: true,
            riderInfo: sharedRide.riderInfo,
          }
        : {
            enabled: false,
          },
    });

    // Populate vehicle details for the response
    await booking.populate("vehicle", "name brand vehicleType image");

    console.log("Booking created successfully:", booking._id);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error creating booking",
    });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle", "name brand vehicleType image")
      .sort("-createdAt");

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// @desc    Get a single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle", "name brand vehicleType image");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the user
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Check if booking can be cancelled
    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

// @desc    Get booking availability for a vehicle
// @route   GET /api/bookings/availability/:vehicleId
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { vehicleId } = req.params;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide start and end dates",
      });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check for overlapping bookings
    const bookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDateTime: { $lte: new Date(startDate) },
          endDateTime: { $gt: new Date(startDate) },
        },
        {
          startDateTime: { $lt: new Date(endDate) },
          endDateTime: { $gte: new Date(endDate) },
        },
      ],
    }).select("startDateTime endDateTime");

    res.json({
      success: true,
      data: {
        available: bookings.length === 0,
        existingBookings: bookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking availability",
      error: error.message,
    });
  }
};
