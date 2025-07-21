const Newsletter = require("../models/Newsletter");
const emailService = require("../utils/emailService");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already subscribed" });
    }
    const subscriber = await Newsletter.create({ email });
    // Send confirmation email
    await emailService.sendNewsletterSubscription(email);
    res
      .status(201)
      .json({
        success: true,
        message: "Subscribed successfully",
        data: subscriber,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Subscription failed",
      error: error.message,
    });
  }
};
