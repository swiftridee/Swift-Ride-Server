# Swift Ride Admin Server

This is the backend server for the Swift Ride admin dashboard, built with Node.js, Express.js, and MongoDB.

## Features

- JWT Authentication for Admin
- Dashboard Statistics
- Booking Management
- User Management
- Vehicle Management
- Analytics and Reports

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/swift-ride
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h
   ADMIN_EMAIL=admin@swiftride.com
   ADMIN_PASSWORD=admin123
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- POST `/api/auth/admin/login` - Admin login

### Admin Dashboard

- GET `/api/admin/dashboard` - Get dashboard statistics
- GET `/api/admin/analytics` - Get analytics data

### Bookings

- GET `/api/admin/bookings` - Get all bookings
- PUT `/api/admin/bookings/:id` - Update booking status

### Users

- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:id` - Update user status (block/unblock)

## Project Structure

```
src/
├── config/
│   └── config.js
├── controllers/
│   ├── authController.js
│   └── adminController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   └── admin.js
└── server.js
```

## Security

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive data

## Error Handling

The server includes global error handling middleware that catches and processes any unhandled errors, returning appropriate error responses to the client.
