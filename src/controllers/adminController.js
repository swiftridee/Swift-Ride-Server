const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const moment = require("moment");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const lastWeek = moment().subtract(7, "days").startOf("day");
    const lastMonth = moment().subtract(1, "months").startOf("day");

    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today.toDate() },
    });

    // Yesterday's bookings
    const yesterdayBookings = await Booking.countDocuments({
      createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() },
    });

    // Calculate booking percentage change
    const bookingPercentageChange =
      yesterdayBookings === 0
        ? 100
        : ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100;

    // Total vehicles and new vehicles this week
    const totalVehicles = await Vehicle.countDocuments();
    const newVehiclesThisWeek = await Vehicle.countDocuments({
      createdAt: { $gte: lastWeek.toDate() },
    });

    // Total users and growth this month
    const totalUsers = await User.countDocuments({ role: "user" });
    const newUsersThisMonth = await User.countDocuments({
      role: "user",
      createdAt: { $gte: lastMonth.toDate() },
    });

    // Calculate user growth percentage
    const userGrowthPercentage = (
      (newUsersThisMonth / totalUsers) *
      100
    ).toFixed(2);

    // Revenue calculations
    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: today.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const overallRevenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookings: {
          today: todayBookings,
          percentageChange: bookingPercentageChange.toFixed(2),
        },
        vehicles: {
          total: totalVehicles,
          newThisWeek: newVehiclesThisWeek,
        },
        users: {
          total: totalUsers,
          growthThisMonth: userGrowthPercentage,
        },
        revenue: {
          today: todayRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
          overall: overallRevenue[0]?.total || 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "brand vehicleType")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update user status (block/unblock)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    // Booking trends (last 6 months)
    const sixMonthsAgo = moment().subtract(6, "months").startOf("month");
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo.toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Popular vehicles
    const popularVehicles = await Booking.aggregate([
      {
        $group: {
          _id: "$vehicle",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
    ]);

    // Revenue growth (last 6 months)
    const revenueGrowth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo.toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookingTrends,
        popularVehicles,
        revenueGrowth,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get general statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total counts
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({
      status: "Available",
    });
    const unavailableVehicles = await Vehicle.countDocuments({
      status: "Unavailable",
    });
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBookings = await Booking.countDocuments();

    // Get revenue stats
    const revenueStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          averageRevenue: { $avg: "$price" },
        },
      },
    ]);

    // Get vehicle type distribution
    const vehicleTypes = await Vehicle.aggregate([
      {
        $group: {
          _id: "$vehicleType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        availableVehicles,
        unavailableVehicles,
        totalUsers,
        totalBookings,
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          average: revenueStats[0]?.averageRevenue || 0,
        },
        vehicleTypes: vehicleTypes.reduce((acc, type) => {
          acc[type._id] = type.count;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
