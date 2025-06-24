# Swift-Ride-Server

## Overview

Swift-Ride-Server is the backend server for the Swift Ride admin dashboard. It provides secure RESTful APIs for managing users, vehicles, bookings, analytics, and admin authentication. Built with Node.js, Express.js, and MongoDB, it powers the administrative operations of the Swift Ride platform.

---

## Tech Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi, express-validator
- **Password Hashing:** bcryptjs
- **Environment Management:** dotenv
- **Logging:** morgan
- **CORS:** cors
- **Date Utilities:** moment
- **Development Tools:** nodemon

---

## Features

- **Admin Authentication:**  
  Secure login for admin users using JWT tokens. Passwords are hashed for security.

- **Dashboard Statistics:**  
  Aggregated statistics for vehicles, users, bookings, and revenue.

- **Booking Management:**  
  View, update, and manage all ride bookings. Change booking status and assign vehicles/users.

- **User Management:**  
  View all users, block/unblock users, and manage user details.

- **Vehicle Management:**  
  Add, update, or remove vehicles. Manage vehicle details, status, and rental plans.

- **Analytics & Reports:**  
  Access analytics endpoints for booking trends, popular vehicles, and revenue.

- **Robust Security:**  
  All admin routes are protected with JWT authentication. Sensitive data is managed via environment variables.

- **Error Handling:**  
  Global error handling middleware ensures consistent and informative API responses.

---

## API Endpoints

### Authentication

- `POST /api/auth/admin/login`  
  Authenticate an admin and receive a JWT token.

### Admin Dashboard

- `GET /api/admin/dashboard`  
  Retrieve dashboard statistics (counts, revenue, etc.).
- `GET /api/admin/analytics`  
  Get analytics data for bookings, vehicles, and revenue.

### Bookings

- `GET /api/admin/bookings`  
  List all bookings with filters and pagination.
- `PUT /api/admin/bookings/:id`  
  Update the status or details of a booking.

### Users

- `GET /api/admin/users`  
  List all users.
- `PUT /api/admin/users/:id`  
  Update user status (block/unblock) or details.

### Vehicles

- `GET /api/admin/vehicles`  
  List all vehicles.
- `POST /api/admin/vehicles`  
  Add a new vehicle.
- `PUT /api/admin/vehicles/:id`  
  Update vehicle details.
- `DELETE /api/admin/vehicles/:id`  
  Remove a vehicle.

---

## Data Models

- **User:**  
  Stores user information, authentication details, and status.
- **Vehicle:**  
  Stores vehicle details, status, rental plans, and features.
- **Booking:**  
  Stores booking information, user/vehicle references, and status.

---

## Project Structure

```
src/
  config/         # Configuration files (e.g., DB connection)
  controllers/    # Route logic for auth, admin, bookings, vehicles
  middleware/     # JWT auth, error handling, etc.
  models/         # Mongoose models (User, Vehicle, Booking)
  routes/         # Express route definitions
  scripts/        # Utility scripts (e.g., create admin)
  server.js       # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Setup

```sh
# Clone the repository
git clone https://github.com/swiftridee/Swift-Ride-Server.git
cd Swift-Ride-Server

# Install dependencies
npm install

# Create a .env file in the root directory with the following variables:
# (edit values as needed)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swift-ride
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
ADMIN_EMAIL=admin@swiftride.com
ADMIN_PASSWORD=admin123

# Start the server
npm start
```

---

## Security

- All admin routes require JWT authentication.
- Passwords are securely hashed.
- Sensitive data is managed via environment variables.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the ISC License.
