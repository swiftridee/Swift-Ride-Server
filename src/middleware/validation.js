const Joi = require("joi");

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

const vehicleSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Vehicle name is required",
    "any.required": "Vehicle name is required",
  }),
  brand: Joi.string().required().trim().messages({
    "string.empty": "Brand is required",
    "any.required": "Brand is required",
  }),
  vehicleType: Joi.string()
    .valid("Car", "Mini Bus", "Bus", "Coaster")
    .required()
    .messages({
      "any.only": "Vehicle type must be one of: Car, Mini Bus, Bus, Coaster",
      "any.required": "Vehicle type is required",
    }),
  location: Joi.string()
    .valid(...PUNJAB_CITIES)
    .required()
    .messages({
      "any.only": "Location must be a valid Punjab city",
      "any.required": "Location is required",
    }),
  seats: Joi.number().min(1).max(100).required().messages({
    "number.base": "Number of seats must be a number",
    "number.min": "Number of seats must be at least 1",
    "number.max": "Number of seats cannot exceed 100",
    "any.required": "Number of seats is required",
  }),
  features: Joi.array()
    .items(Joi.string().valid(...VEHICLE_FEATURES))
    .unique()
    .messages({
      "array.base": "Features must be an array",
      "array.unique": "Features must be unique",
      "any.only": "Features must be valid vehicle features",
    }),
  image: Joi.string().required().messages({
    "string.empty": "Vehicle image is required",
    "any.required": "Vehicle image is required",
  }),
  status: Joi.string().valid("Available", "Unavailable").required().messages({
    "any.only": "Status must be either Available or Unavailable",
    "any.required": "Status is required",
  }),
  rentalPlan: Joi.object({
    basePrice: Joi.number().min(0).required().messages({
      "number.base": "Base price must be a number",
      "number.min": "Base price must be positive",
      "any.required": "Base price is required",
    }),
    driverFeeEnabled: Joi.boolean().required().messages({
      "boolean.base": "Driver fee enabled must be a boolean",
      "any.required": "Driver fee enabled is required",
    }),
  })
    .required()
    .messages({
      "object.base": "Rental plan must be an object",
      "any.required": "Rental plan is required",
    }),
});

const validateVehicle = (req, res, next) => {
  const { error } = vehicleSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

module.exports = {
  validateVehicle,
};
