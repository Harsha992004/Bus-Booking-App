const express = require('express');
const { query } = require('express-validator');
const { getAllCities, POPULAR_ROUTES, calculateFare, BUS_TYPES } = require('../config/andhraRoutes');

const router = express.Router();

// @route   GET /api/routes/cities
// @desc    Get all Andhra Pradesh cities
// @access  Public
router.get('/cities', async (req, res) => {
  try {
    const cities = getAllCities();
    res.json({
      success: true,
      data: { cities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching cities',
      error: error.message
    });
  }
});

// @route   GET /api/routes/search
// @desc    Search routes between cities
// @access  Public
router.get('/search', [
  query('from').notEmpty().withMessage('From city is required'),
  query('to').notEmpty().withMessage('To city is required')
], async (req, res) => {
  try {
    const errors = query(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { from, to, busType } = req.query;
    
    // Find matching routes
    const routes = POPULAR_ROUTES.filter(route => 
      route.source.toLowerCase() === from.toLowerCase() && 
      route.destination.toLowerCase() === to.toLowerCase()
    );

    // Calculate fares for each bus type
    const routesWithFares = routes.map(route => {
      const fares = {};
      Object.keys(BUS_TYPES).forEach(type => {
        BUS_TYPES[type].seatCategories.forEach(cat => {
          fares[type] = fares[type] || {};
          fares[type][cat.category] = calculateFare(
            route.distance, 
            type, 
            cat.category
          );
        });
      });

      return {
        ...route,
        fares
      };
    });

    res.json({
      success: true,
      data: {
        routes: routesWithFares,
        total: routesWithFares.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error searching routes',
      error: error.message
    });
  }
});

// @route   GET /api/routes/popular
// @desc    Get popular routes
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const popularRoutes = POPULAR_ROUTES.slice(0, limit).map(route => ({
      ...route,
      baseFare: calculateFare(route.distance, 'standard')
    }));

    res.json({
      success: true,
      data: {
        routes: popularRoutes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching popular routes',
      error: error.message
    });
  }
});

// @route   GET /api/routes/fare
// @desc    Calculate fare for a route
// @access  Public
router.get('/fare', async (req, res) => {
  try {
    const { from, to, busType, seatCategory } = req.query;
    
    // Find the route
    const route = POPULAR_ROUTES.find(r => 
      r.source === from && r.destination === to
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const fare = calculateFare(
      route.distance,
      busType || 'standard',
      seatCategory || 'seater'
    );

    res.json({
      success: true,
      data: {
        route: {
          from,
          to,
          distance: route.distance,
          duration: route.duration
        },
        busType: busType || 'standard',
        seatCategory: seatCategory || 'seater',
        fare,
        baseFare: calculateFare(route.distance, 'standard'),
        distance: route.distance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error calculating fare',
      error: error.message
    });
  }
});

// @route   GET /api/routes/bus-types
// @desc    Get available bus types and their configurations
// @access  Public
router.get('/bus-types', async (req, res) => {
  try {
    const busTypes = Object.keys(BUS_TYPES).map(key => ({
      id: key,
      ...BUS_TYPES[key]
    }));

    res.json({
      success: true,
      data: { busTypes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching bus types',
      error: error.message
    });
  }
});

module.exports = router;
