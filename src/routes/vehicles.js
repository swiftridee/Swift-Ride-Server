const express = require("express");
const router = express.Router();
const { getVehicles, getVehicle } = require("../controllers/vehicleController");

// Public routes
router.get("/", getVehicles);
router.get("/:id", getVehicle);

module.exports = router;
