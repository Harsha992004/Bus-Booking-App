const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user bookings (or all bookings for admin)
// @access  Private
router.get('/', authenticate, [
  query('status').optional().isIn(['pending', 'confirmed', 'paid', 'cancelled', 'completed']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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

    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admin can see all bookings
      if (status) {
        query.status = status;
      }
    } else {
      // Regular users can only see their own bookings
      query.user = req.user._id;
      if (status) {
        query.status = status;
      }
    }

    // Get bookings with populated bus and user data
    const bookings = await Booking.find(query)
      .populate('bus', 'name fromCity toCity departTime arriveTime fare')
      .populate('user', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    const formattedBookings = bookings.map(booking => ({
      ...booking.getFormattedData(),
      bus: booking.bus,
      user: req.user.role === 'admin' ? booking.user : undefined
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
        }
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

// @route   GET /api/bookings/:id
// @desc    Get specific booking details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bus', 'name fromCity toCity departTime arriveTime fare seatsTotal busType amenities')
      .populate('user', 'email profile.firstName profile.lastName profile.phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to view this booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking details',
      error: error.message
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticate, [
  body('bus').isMongoId().withMessage('Valid bus ID is required'),
  body('passengerName').notEmpty().withMessage('Passenger name is required'),
  body('passengerPhone').isMobilePhone().withMessage('Valid phone number is required'),
  body('passengerEmail').isEmail().withMessage('Valid email is required'),
  body('seatsBooked').isInt({ min: 1 }).withMessage('Must book at least 1 seat'),
  body('travelDate').isISO8601().withMessage('Valid travel date is required'),
  body('seatNumbers').isArray().withMessage('Seat numbers must be an array')
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
      bus,
      passengerName,
      passengerPhone,
      passengerEmail,
      seatsBooked,
      travelDate,
      seatNumbers,
      specialRequests
    } = req.body;

    // Check if bus exists and is active
    const busData = await Bus.findById(bus);
    if (!busData || !busData.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found or inactive'
      });
    }

    // Check seat availability
    const availability = await Booking.getSeatAvailability(bus, travelDate);
    if (availability.availableSeats < seatsBooked) {
      return res.status(400).json({
        success: false,
        message: `Only ${availability.availableSeats} seats available for this date`
      });
    }

    // Check if requested seat numbers are already booked
    if (seatNumbers && seatNumbers.length > 0) {
      const existingBookings = await Booking.find({
        bus,
        travelDate: new Date(travelDate),
        status: { $in: ['confirmed', 'paid'] },
        'seatNumbers': { $in: seatNumbers }
      });

      if (existingBookings.length > 0) {
        const bookedSeats = existingBookings.reduce((acc, booking) => {
          return [...acc, ...booking.seatNumbers.filter(seat => seatNumbers.includes(seat))];
        }, []);
        
        return res.status(400).json({
          success: false,
          message: `Seats ${bookedSeats.join(', ')} are already booked`
        });
      }
    }

    // Calculate total fare
    const totalFare = busData.fare * seatsBooked;

    // Create booking
    const booking = new Booking({
      bus,
      user: req.user._id,
      passengerName,
      passengerPhone,
      passengerEmail,
      seatsBooked,
      seatNumbers: seatNumbers || [],
      travelDate: new Date(travelDate),
      totalFare,
      specialRequests,
      status: 'confirmed'
    });

    await booking.save();

    // Populate bus data for response
    await booking.populate('bus', 'name fromCity toCity departTime arriveTime fare');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/pay
// @desc    Mark booking as paid
// @access  Private
router.put('/:id/pay', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid'
      });
    }

    // Update payment status
    booking.paymentStatus = 'paid';
    booking.status = 'paid';
    booking.paymentReference = req.body.paymentReference || `PAY${Date.now()}`;
    booking.paidAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing payment',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', authenticate, [
  body('reason').optional().notEmpty().withMessage('Cancellation reason cannot be empty')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();

    // Process refund if payment was made
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking: booking.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
      error: error.message
    });
  }
});

module.exports = router;
