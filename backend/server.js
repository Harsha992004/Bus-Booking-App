
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

// Load env variables FIRST (only in development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
console.log("ENV CHECK:", process.env.MONGODB_URI);

// Create app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - Allow Vercel and localhost
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const routeConfigRoutes = require('./routes/routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeConfigRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bus Booking API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => {
    console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;