const Vehicle = require("../models/Vehicle");

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all vehicles with pagination and field selection
exports.getVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(
      `Fetching vehicles - page: ${page}, limit: ${limit}, skip: ${skip}`
    );

    // Get filter parameters
    const { brand, vehicleType, location, status } = req.query;

    // Build filter object
    const filter = {};
    if (brand) filter.brand = new RegExp(brand, "i");
    if (vehicleType) filter.vehicleType = vehicleType;
    if (location) filter.location = location;
    if (status) filter.status = status;

    console.log("Filter:", JSON.stringify(filter));

    // Get total count before applying skip and limit
    const total = await Vehicle.countDocuments(filter);
    console.log("Total vehicles:", total);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    console.log("Total pages:", totalPages);

    // Validate page number
    if (page > totalPages && totalPages > 0) {
      console.log(`Invalid page number ${page}. Total pages: ${totalPages}`);
      return res.status(400).json({
        success: false,
        error: `Page ${page} does not exist. Total pages: ${totalPages}`,
      });
    }

    // Select only necessary fields
    const select =
      "name brand vehicleType location seats features status rentalPlan image";

    // Execute query with pagination
    const vehicles = await Vehicle.find(filter)
      .select(select)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .allowDiskUse(true);

    console.log(`Found ${vehicles.length} vehicles for page ${page}`);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching vehicles",
    });
  }
};

// Get single vehicle
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
