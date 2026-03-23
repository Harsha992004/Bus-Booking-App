const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/buses
// @desc    Get all buses with optional filtering
// @access  Public
router.get('/', [
  query('from').optional().notEmpty().withMessage('From city cannot be empty'),
  query('to').optional().notEmpty().withMessage('To city cannot be empty'),
  query('date').optional().isISO8601().withMessage('Date must be valid')
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

    const { from, to, date, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (from) {
      query.fromCity = { $regex: from, $options: 'i' };
    }
    
    if (to) {
      query.toCity = { $regex: to, $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get buses
    const buses = await Bus.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Bus.countDocuments(query);

    // If date is provided, get seat availability for each bus
    let busesWithAvailability = buses;
    if (date) {
      busesWithAvailability = await Promise.all(
        buses.map(async (bus) => {
          try {
            const availability = await Booking.getSeatAvailability(bus._id, date);
            return {
              ...bus.getFormattedData(),
              seatAvailability: availability
            };
          } catch (error) {
            return {
              ...bus.getFormattedData(),
              seatAvailability: {
                totalSeats: bus.seatsTotal,
                bookedSeats: 0,
                availableSeats: bus.seatsTotal
              }
            };
          }
        })
      );
    } else {
      busesWithAvailability = buses.map(bus => bus.getFormattedData());
    }

    res.json({
      success: true,
      data: {
        buses: busesWithAvailability,
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
      message: 'Server error fetching buses',
      error: error.message
    });
  }
});

// @route   GET /api/buses/:id
// @desc    Get specific bus details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus || !bus.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const busData = bus.getFormattedData();

    // If date query is provided, include seat availability
    if (req.query.date) {
      try {
        const availability = await Booking.getSeatAvailability(bus._id, req.query.date);
        busData.seatAvailability = availability;
      } catch (error) {
        busData.seatAvailability = {
          totalSeats: bus.seatsTotal,
          bookedSeats: 0,
          availableSeats: bus.seatsTotal
        };
      }
    }

    res.json({
      success: true,
      data: { bus: busData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching bus details',
      error: error.message
    });
  }
});

// @route   GET /api/buses/:id/seats
// @desc    Get seat availability for a specific bus on a specific date
// @access  Public
router.get('/:id/seats', [
  query('date').isISO8601().withMessage('Date is required and must be valid')
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

    const { id } = req.params;
    const { date } = req.query;

    // Check if bus exists
    const bus = await Bus.findById(id);
    if (!bus || !bus.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Get seat availability
    const availability = await Booking.getSeatAvailability(id, date);

    // Get booked seat numbers for that date
    const bookedSeats = await Booking.find({
      bus: id,
      travelDate: new Date(date),
      status: { $in: ['confirmed', 'paid'] }
    }).select('seatNumbers');

    const bookedSeatNumbers = bookedSeats.reduce((acc, booking) => {
      return [...acc, ...booking.seatNumbers];
    }, []);

    res.json({
      success: true,
      data: {
        busId: id,
        travelDate: date,
        totalSeats: availability.totalSeats,
        bookedSeats: availability.bookedSeats,
        availableSeats: availability.availableSeats,
        bookedSeatNumbers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching seat availability',
      error: error.message
    });
  }
});

// @route   POST /api/buses
// @desc    Create a new bus
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, [
  body('name').notEmpty().withMessage('Bus name is required'),
  body('fromCity').notEmpty().withMessage('From city is required'),
  body('toCity').notEmpty().withMessage('To city is required'),
  body('departTime').notEmpty().withMessage('Departure time is required'),
  body('arriveTime').notEmpty().withMessage('Arrival time is required'),
  body('seatsTotal').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  body('fare').isFloat({ min: 0 }).withMessage('Fare must be a positive number')
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

    const busData = req.body;
    const bus = new Bus(busData);
    await bus.save();

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: { bus: bus.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating bus',
      error: error.message
    });
  }
});

// @route   PUT /api/buses/:id
// @desc    Update a bus
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().notEmpty().withMessage('Bus name cannot be empty'),
  body('fromCity').optional().notEmpty().withMessage('From city cannot be empty'),
  body('toCity').optional().notEmpty().withMessage('To city cannot be empty'),
  body('departTime').optional().notEmpty().withMessage('Departure time cannot be empty'),
  body('arriveTime').optional().notEmpty().withMessage('Arrival time cannot be empty'),
  body('seatsTotal').optional().isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  body('fare').optional().isFloat({ min: 0 }).withMessage('Fare must be a positive number')
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

    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Update bus fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        bus[key] = req.body[key];
      }
    });

    await bus.save();

    res.json({
      success: true,
      message: 'Bus updated successfully',
      data: { bus: bus.getFormattedData() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating bus',
      error: error.message
    });
  }
});

// @route   DELETE /api/buses/:id
// @desc    Delete a bus (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Soft delete by setting isActive to false
    bus.isActive = false;
    await bus.save();

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting bus',
      error: error.message
    });
  }
});

// @route   GET /api/locations
// @desc    Get unique cities for search suggestions
// @access  Public
router.get('/locations/cities', async (req, res) => {
  try {
    const { q } = req.query;
    
    let cities = [];
    
    if (q) {
      // Get cities that match the query
      const fromCities = await Bus.distinct('fromCity', {
        fromCity: { $regex: q, $options: 'i' },
        isActive: true
      });
      
      const toCities = await Bus.distinct('toCity', {
        toCity: { $regex: q, $options: 'i' },
        isActive: true
      });
      
      cities = [...new Set([...fromCities, ...toCities])].slice(0, 10);
    } else {
      // Get all unique cities
      const fromCities = await Bus.distinct('fromCity', { isActive: true });
      const toCities = await Bus.distinct('toCity', { isActive: true });
      cities = [...new Set([...fromCities, ...toCities])];
    }

    res.json({
      success: true,
      data: { cities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching locations',
      error: error.message
    });
  }
});

module.exports = router;
