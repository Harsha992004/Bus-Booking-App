const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

// Load env variables FIRST
dotenv.config();

// Create app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// Error handler (must be last)
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5003;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});