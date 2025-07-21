const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");

// POST /api/newsletter/subscribe
router.post("/subscribe", newsletterController.subscribe);

module.exports = router;
