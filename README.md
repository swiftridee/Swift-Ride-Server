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

## Deployment

### Vercel Deployment

This application is configured for Vercel deployment. See `DEPLOYMENT.md` for detailed instructions.

**Quick Setup:**
1. Set environment variables in Vercel dashboard
2. Deploy using Vercel CLI or GitHub integration
3. Test deployment using: `npm run test-deployment`

### Environment Variables for Production

Required environment variables for Vercel deployment:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secure JWT signing key
- `NODE_ENV` - Set to "production"

## API Endpoints

### Public Routes
- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/test` - Test route
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `GET /api/bookings/availability/:vehicleId` - Check vehicle availability
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Protected Routes (Require JWT Token)
- `GET /api/admin/*` - Admin routes
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

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
│   ├── adminController.js
│   ├── bookingController.js
│   └── vehicleController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── bookings.js
│   └── vehicles.js
├── utils/
│   └── emailService.js
└── server.js
```

## Testing

Test the deployment using the provided test script:

```bash
npm run test-deployment
```

## Security

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive data
- Improved error handling and validation

## Error Handling

The server includes global error handling middleware that catches and processes any unhandled errors, returning appropriate error responses to the client.

## Recent Fixes

- Fixed environment variable configuration for Vercel deployment
- Improved server configuration for serverless environment
- Enhanced error handling and logging
- Added health check and test routes
- Updated Vercel configuration for better routing
- Improved authentication middleware with better error messages
