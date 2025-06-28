# Vercel Deployment Guide

## Environment Variables Setup

Before deploying to Vercel, make sure to set up the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/swift-ride`

2. **JWT_SECRET**
   - A secure random string for JWT token signing
   - Example: `your-super-secret-jwt-key-change-this-in-production`

3. **NODE_ENV**
   - Set to `production` for Vercel deployment

### Optional Environment Variables

4. **JWT_EXPIRE**
   - JWT token expiration time (default: 24h)

5. **ADMIN_EMAIL**
   - Admin email address (default: admin@swiftride.com)

6. **ADMIN_PASSWORD**
   - Admin password (default: admin123)

7. **EMAIL_HOST**
   - SMTP host for email service (default: smtp.gmail.com)

8. **EMAIL_PORT**
   - SMTP port (default: 587)

9. **EMAIL_USER**
   - Email username

10. **EMAIL_PASS**
    - Email password/app-specific password

11. **EMAIL_FROM**
    - From email address

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its corresponding value
5. Redeploy your application

## Testing the Deployment

After deployment, test these endpoints:

1. **Health Check**: `GET /api/health`
2. **Test Route**: `GET /api/test`
3. **Welcome Route**: `GET /`

## Common Issues and Solutions

### 404 Error
- Check if all routes are properly configured in `vercel.json`
- Ensure the server is exporting the app correctly
- Verify environment variables are set

### MongoDB Connection Error
- Check if MongoDB URI is correct
- Ensure MongoDB Atlas network access allows Vercel IPs
- Verify database credentials

### JWT Issues
- Ensure JWT_SECRET is set and secure
- Check if JWT_EXPIRE is properly formatted

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