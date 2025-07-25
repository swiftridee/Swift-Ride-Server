const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const emailService = require("../utils/emailService");

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
      paymentInfo,
    } = req.body;

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

    // Prepare booking data
    const bookingData = {
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      includeDriver,
      price: paymentInfo?.payment,
      status: "confirmed", // Set status as confirmed
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
    };

    // Add payment info if provided
    if (paymentInfo) {
      bookingData.paymentInfo = {
        paymentMethod: paymentInfo.paymentMethod,
        cardName: paymentInfo.cardName,
        maskedCardNumber: paymentInfo.maskedCardNumber,
        expiryDate: paymentInfo.expiryDate,
        saveCard: paymentInfo.saveCard,
        paymentDate: paymentInfo.paymentDate
          ? new Date(paymentInfo.paymentDate)
          : new Date(),
        paymentStatus: paymentInfo.paymentStatus || "completed",
        transactionId: paymentInfo.transactionId,
      };
    }

    // Create booking
    const booking = await Booking.create(bookingData);

    // Populate vehicle details for the response and email
    await booking.populate([
      { path: "vehicle", select: "name brand vehicleType image" },
      { path: "user", select: "name email" },
    ]);

    // Send confirmation email
    await emailService.sendBookingConfirmation(booking, booking.user);

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
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("vehicle");
    console.log("booking from server", booking);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the user
    if (booking.user?._id.toString() !== req.user._id.toString()) {
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

    // Send cancellation email
    await emailService.sendBookingCancellation(booking, booking.user);

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
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
