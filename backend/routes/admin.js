const express = require('express');
const { query } = require('express-validator');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic statistics
    const totalBuses = await Bus.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ isActive: true });
    
    // Get booking statistics by status
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalFare' }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('bus', 'name fromCity toCity')
      .populate('user', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get revenue for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRevenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          paidAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalFare' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get popular routes
    const popularRoutes = await Booking.aggregate([
      {
        $lookup: {
          from: 'buses',
          localField: 'bus',
          foreignField: '_id',
          as: 'busInfo'
        }
      },
      {
        $unwind: '$busInfo'
      },
      {
        $group: {
          _id: {
            from: '$busInfo.fromCity',
            to: '$busInfo.toCity'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const dashboardData = {
      stats: {
        totalBuses,
        totalBookings,
        totalUsers,
        recentRevenue: recentRevenue.length > 0 ? recentRevenue[0].total : 0,
        recentBookings: recentRevenue.length > 0 ? recentRevenue[0].count : 0
      },
      bookingStats: bookingStats.reduce((acc, stat) => {
        acc[stat._id] = { count: stat.count, revenue: stat.totalRevenue };
        return acc;
      }, {}),
      recentBookings: recentBookings.map(booking => booking.getFormattedData()),
      popularRoutes: popularRoutes.map(route => ({
        from: route._id.from,
        to: route._id.to,
        bookings: route.count
      }))
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with advanced filtering (admin version)
// @access  Private (Admin only)
router.get('/bookings', [
  query('status').optional().isIn(['pending', 'confirmed', 'paid', 'cancelled', 'completed']).withMessage('Invalid status'),
  query('payment').optional().isIn(['pending', 'paid', 'refunded']).withMessage('Invalid payment status'),
  query('dateFrom').optional().isISO8601().withMessage('Invalid date format'),
  query('dateTo').optional().isISO8601().withMessage('Invalid date format'),
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('Limit must be between 1 and 200')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      status,
      payment: paymentStatus,
      dateFrom,
      dateTo,
      q,
      page = 1,
      limit = 50
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Search filter
    if (q) {
      query.$or = [
        { bookingReference: { $regex: q, $options: 'i' } },
        { passengerName: { $regex: q, $options: 'i' } },
        { passengerEmail: { $regex: q, $options: 'i' } },
        { passengerPhone: { $regex: q, $options: 'i' } }
      ];
    }

    // Get bookings with populated data
    const bookings = await Booking.find(query)
      .populate('bus', 'name fromCity toCity departTime arriveTime')
      .populate('user', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Booking.countDocuments(query);

    const formattedBookings = bookings.map(booking => ({
      ...booking.getFormattedData(),
      bus: booking.bus,
      user: booking.user
    }));

    res.json({
      success: true,
      data: {
        bookings: formattedBookings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: { status, paymentStatus, dateFrom, dateTo, q }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private (Admin only)
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'paid', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    
    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      if (booking.paymentStatus === 'paid') {
        booking.paymentStatus = 'refunded';
      }
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/bookings/:id/payment
// @desc    Update payment status (admin only)
// @access  Private (Admin only)
router.put('/bookings/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, paymentReference } = req.body;
    
    if (!['pending', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.paymentStatus = paymentStatus;
    
    if (paymentReference) {
      booking.paymentReference = paymentReference;
    }
    
    if (paymentStatus === 'paid') {
      booking.paidAt = new Date();
      booking.status = 'paid';
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating payment status',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/bookings/:id/release-seats
// @desc    Release seats from a booking (admin only)
// @access  Private (Admin only)
router.put('/bookings/:id/release-seats', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Clear seat numbers
    booking.seatNumbers = [];
    await booking.save();

    res.json({
      success: true,
      message: 'Seats released successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error releasing seats',
      error: error.message
    });
  }
});

// @route   GET /api/admin/export/buses
// @desc    Export buses as CSV
// @access  Private (Admin only)
router.get('/export/buses', async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true }).sort({ createdAt: -1 });

    const csvData = buses.map(bus => ({
      ID: bus._id,
      Name: bus.name,
      'From City': bus.fromCity,
      'To City': bus.toCity,
      'Depart Time': bus.departTime,
      'Arrive Time': bus.arriveTime,
      'Total Seats': bus.seatsTotal,
      Fare: bus.fare,
      'Bus Type': bus.busType,
      Amenities: bus.amenities.join(', '),
      'Created At': bus.createdAt.toISOString()
    }));

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../temp/buses_export.csv'),
      header: Object.keys(csvData[0] || {}).map(key => ({ id: key, title: key }))
    });

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=buses.csv');
    
    const csvFile = fs.createReadStream(path.join(__dirname, '../temp/buses_export.csv'));
    csvFile.pipe(res);

    // Clean up temp file
    csvFile.on('end', () => {
      fs.unlinkSync(path.join(__dirname, '../temp/buses_export.csv'));
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error exporting buses',
      error: error.message
    });
  }
});

// @route   GET /api/admin/export/bookings
// @desc    Export bookings as CSV
// @access  Private (Admin only)
router.get('/export/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('bus', 'name fromCity toCity')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    const csvData = bookings.map(booking => ({
      'Booking ID': booking.bookingReference,
      'Bus Name': booking.bus?.name || 'N/A',
      'From City': booking.bus?.fromCity || 'N/A',
      'To City': booking.bus?.toCity || 'N/A',
      'Passenger Name': booking.passengerName,
      'Passenger Email': booking.passengerEmail,
      'Passenger Phone': booking.passengerPhone,
      'Seats Booked': booking.seatsBooked,
      'Seat Numbers': booking.seatNumbers.join(', '),
      'Travel Date': booking.travelDate.toISOString(),
      'Total Fare': booking.totalFare,
      Status: booking.status,
      'Payment Status': booking.paymentStatus,
      'Payment Reference': booking.paymentReference || '',
      'Created At': booking.createdAt.toISOString()
    }));

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../temp/bookings_export.csv'),
      header: Object.keys(csvData[0] || {}).map(key => ({ id: key, title: key }))
    });

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
    
    const csvFile = fs.createReadStream(path.join(__dirname, '../temp/bookings_export.csv'));
    csvFile.pipe(res);

    // Clean up temp file
    csvFile.on('end', () => {
      fs.unlinkSync(path.join(__dirname, '../temp/bookings_export.csv'));
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error exporting bookings',
      error: error.message
    });
  }
});

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

module.exports = router;
