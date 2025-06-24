const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  checkAvailability,
} = require("../controllers/bookingController");

// Public routes
router.get("/availability/:vehicleId", checkAvailability);

// Protected routes
router.use(protect);
router.route("/").post(createBooking).get(getMyBookings);

router.route("/:id").get(getBooking);

router.put("/:id/cancel", cancelBooking);

module.exports = router;
