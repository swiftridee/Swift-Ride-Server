const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const config = require("../config/config");
const axios = require("axios");

// Function to convert image URL to base64
async function getBase64FromUrl(url) {
  try {
    // Download the image
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Convert to base64
    const base64 = Buffer.from(response.data, "binary").toString("base64");

    // Get the content type from the response headers
    const contentType = response.headers["content-type"];

    // Return the complete base64 string with data URI scheme
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting image ${url} to base64:`, error.message);
    // Return a default image or placeholder if conversion fails
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
  }
}

// Mock data arrays
const carsData = [
  {
    name: "Camry",
    brand: "Toyota",
    vehicleType: "Car",
    location: "Lahore",
    seats: 5,
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Leather Seats",
      "GPS Navigation",
      "Reverse Camera",
    ],
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
    rentalPlan: {
      basePrice: 5000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Civic",
    brand: "Honda",
    vehicleType: "Car",
    location: "Lahore",
    seats: 5,
    features: [
      "Air Conditioning",
      "Bluetooth",
      "GPS Navigation",
      "Reverse Camera",
      "Sunroof",
    ],
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
    rentalPlan: {
      basePrice: 5500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "3 Series",
    brand: "BMW",
    vehicleType: "Car",
    location: "Lahore",
    seats: 5,
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Leather Seats",
      "GPS Navigation",
      "Sunroof",
      "Cruise Control",
    ],
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    rentalPlan: {
      basePrice: 8000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "A4",
    brand: "Audi",
    vehicleType: "Car",
    location: "Lahore",
    seats: 5,
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Leather Seats",
      "GPS Navigation",
      "Sunroof",
      "Cruise Control",
    ],
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    rentalPlan: {
      basePrice: 7500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Swift",
    brand: "Suzuki",
    vehicleType: "Car",
    location: "Lahore",
    seats: 5,
    features: [
      "Air Conditioning",
      "Bluetooth",
      "GPS Navigation",
      "Reverse Camera",
    ],
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    rentalPlan: {
      basePrice: 4000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
];

const busesData = [
  {
    name: "ZK6107HA",
    brand: "Yutong",
    vehicleType: "Bus",
    location: "Lahore",
    seats: 50,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
      "Cruise Control",
    ],
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    rentalPlan: {
      basePrice: 25000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "AK1J",
    brand: "Hino",
    vehicleType: "Bus",
    location: "Lahore",
    seats: 55,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
      "Cruise Control",
    ],
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    rentalPlan: {
      basePrice: 28000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "LT134",
    brand: "Isuzu",
    vehicleType: "Bus",
    location: "Lahore",
    seats: 48,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
      "Cruise Control",
    ],
    imageUrl: "https://images.unsplash.com/photo-1525264626954-d57032a1ab1a",
    rentalPlan: {
      basePrice: 26000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
];

const miniBusesData = [
  {
    name: "ZK6729D",
    brand: "Yutong",
    vehicleType: "Mini Bus",
    location: "Lahore",
    seats: 30,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e",
    rentalPlan: {
      basePrice: 17000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Rainbow",
    brand: "Hino",
    vehicleType: "Mini Bus",
    location: "Lahore",
    seats: 28,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    rentalPlan: {
      basePrice: 18500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Journey",
    brand: "Isuzu",
    vehicleType: "Mini Bus",
    location: "Lahore",
    seats: 25,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1525264626954-d57032a1ab1a",
    rentalPlan: {
      basePrice: 17500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
];

const coastersData = [
  {
    name: "Coaster",
    brand: "Toyota",
    vehicleType: "Coaster",
    location: "Lahore",
    seats: 22,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    rentalPlan: {
      basePrice: 12000,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Rosa",
    brand: "Mitsubishi",
    vehicleType: "Coaster",
    location: "Lahore",
    seats: 20,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e",
    rentalPlan: {
      basePrice: 11500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
  {
    name: "Civilian",
    brand: "Nissan",
    vehicleType: "Coaster",
    location: "Lahore",
    seats: 24,
    features: [
      "Air Conditioning",
      "GPS Navigation",
      "Bluetooth",
      "Leather Seats",
    ],
    imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7",
    rentalPlan: {
      basePrice: 12500,
      driverFeeEnabled: true,
    },
    status: "Available",
  },
];

async function seedVehicles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing data");

    // Convert all vehicle data arrays and convert their images to base64
    const processVehicleData = async (vehicleData) => {
      const base64Image = await getBase64FromUrl(vehicleData.imageUrl);
      return {
        ...vehicleData,
        image: base64Image, // Replace imageUrl with base64 image
        imageUrl: undefined, // Remove the imageUrl field
      };
    };

    // Process all vehicle types
    console.log("Converting images to base64...");

    const processedCars = await Promise.all(carsData.map(processVehicleData));
    console.log(`Processed ${processedCars.length} car images`);

    const processedBuses = await Promise.all(busesData.map(processVehicleData));
    console.log(`Processed ${processedBuses.length} bus images`);

    const processedMiniBuses = await Promise.all(
      miniBusesData.map(processVehicleData)
    );
    console.log(`Processed ${processedMiniBuses.length} mini bus images`);

    const processedCoasters = await Promise.all(
      coastersData.map(processVehicleData)
    );
    console.log(`Processed ${processedCoasters.length} coaster images`);

    // Insert all vehicles
    const vehicles = await Vehicle.insertMany([
      ...processedCars,
      ...processedBuses,
      ...processedMiniBuses,
      ...processedCoasters,
    ]);
    console.log(`Inserted ${vehicles.length} vehicles`);

    // Create a sample user ID
    const sampleUserId = new mongoose.Types.ObjectId();

    // Create some sample bookings
    const sampleBookings = [
      {
        user: sampleUserId,
        vehicle: vehicles[0]._id,
        rentalPlan: {
          name: "12-hour",
          duration: 12,
          price: 5000,
        },
        driverOption: true,
        price: 6500,
        status: "pending",
        startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        user: sampleUserId,
        vehicle: vehicles[1]._id,
        rentalPlan: {
          name: "2-day",
          duration: 48,
          price: 11000,
        },
        driverOption: false,
        price: 11000,
        status: "confirmed",
        startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        endDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      },
      {
        user: sampleUserId,
        vehicle: vehicles[2]._id,
        rentalPlan: {
          name: "3-day",
          duration: 72,
          price: 24000,
        },
        driverOption: true,
        price: 26000,
        status: "completed",
        startDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log("Created sample bookings");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeder
seedVehicles();
