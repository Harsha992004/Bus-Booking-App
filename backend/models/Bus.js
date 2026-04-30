const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    trim: true,
    unique: true
  },
  fromCity: {
    type: String,
    required: [true, 'From city is required'],
    trim: true
  },
  toCity: {
    type: String,
    required: [true, 'To city is required'],
    trim: true
  },
  intermediateRoutes: [{
    city: {
      type: String,
      trim: true
    },
    arrivalTime: String,
    departureTime: String,
    distanceFromSource: Number,
    fareFromSource: Number
  }],
  departTime: {
    type: String,
    required: [true, 'Departure time is required'],
    trim: true
  },
  arriveTime: {
    type: String,
    required: [true, 'Arrival time is required'],
    trim: true
  },
  totalDistance: {
    type: Number,
    required: [true, 'Total distance is required']
  },
  duration: {
    type: String,
    required: [true, 'Journey duration is required']
  },
  seatsTotal: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Must have at least 1 seat']
  },
  seatLayout: {
    type: String,
    enum: ['2x1', '2x2', '3x2'],
    default: '2x2'
  },
  seatCategories: [{
    category: {
      type: String,
      enum: ['sleeper', 'semi-sleeper', 'seater', 'luxury']
    },
    seats: Number,
    fare: Number,
    seatNumbers: [String]
  }],
  baseFare: {
    type: Number,
    required: [true, 'Base fare is required'],
    min: [0, 'Fare cannot be negative']
  },
  busType: {
    type: String,
    enum: ['standard', 'deluxe', 'luxury', 'semi-luxury', 'sleeper', 'ac-sleeper'],
    default: 'standard'
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'charging-ports', 'entertainment', 'refreshments', 'blanket', 'pillow', 'water-bottle', 'reading-light', 'emergency-exit']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  schedule: {
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    startDate: Date,
    endDate: Date
  },
  operator: {
    name: {
      type: String,
      required: true
    },
    contact: String,
    email: String,
    logo: String
  },
  driverInfo: {
    name: String,
    contact: String,
    licenseNumber: String
  }
}, {
  timestamps: true
});

// Index for search queries
busSchema.index({ fromCity: 1, toCity: 1 });
busSchema.index({ 'intermediateRoutes.city': 1 });
busSchema.index({ name: 1 });
busSchema.index({ busNumber: 1 });
busSchema.index({ busType: 1 });
busSchema.index({ isActive: 1 });

// Virtual for available seats (will be calculated based on bookings)
busSchema.virtual('seatsAvailable', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'bus',
  count: true,
  match: { status: { $in: ['confirmed', 'pending'] } }
});

// Method to get formatted bus data
busSchema.methods.getFormattedData = function() {
  return {
    id: this._id,
    name: this.name,
    busNumber: this.busNumber,
    fromCity: this.fromCity,
    toCity: this.toCity,
    intermediateRoutes: this.intermediateRoutes,
    departTime: this.departTime,
    arriveTime: this.arriveTime,
    totalDistance: this.totalDistance,
    duration: this.duration,
    seatsTotal: this.seatsTotal,
    seatLayout: this.seatLayout,
    seatCategories: this.seatCategories,
    baseFare: this.baseFare,
    busType: this.busType,
    amenities: this.amenities,
    rating: this.rating,
    operator: this.operator,
    schedule: this.schedule,
    isActive: this.isActive
  };
};

// Method to calculate fare for a specific route
busSchema.methods.calculateFare = function(from, to) {
  // If direct source to destination
  if (from === this.fromCity && to === this.toCity) {
    return this.baseFare;
  }
  
  // Check intermediate routes
  const fromStop = this.intermediateRoutes.find(r => r.city === from);
  const toStop = this.intermediateRoutes.find(r => r.city === to);
  
  if (fromStop && toStop) {
    return Math.abs(toStop.fareFromSource - fromStop.fareFromSource);
  }
  
  // Partial route from source to intermediate
  if (from === this.fromCity && toStop) {
    return toStop.fareFromSource;
  }
  
  // Partial route from intermediate to destination
  if (fromStop && to === this.toCity) {
    return this.baseFare - fromStop.fareFromSource;
  }
  
  return this.baseFare;
};

// Method to get available stops for this bus
busSchema.methods.getStops = function() {
  const stops = [
    { city: this.fromCity, time: this.departTime, type: 'source' },
    ...this.intermediateRoutes.map(r => ({
      city: r.city,
      arrivalTime: r.arrivalTime,
      departureTime: r.departureTime,
      type: 'intermediate'
    })),
    { city: this.toCity, time: this.arriveTime, type: 'destination' }
  ];
  return stops;
};

module.exports = mongoose.model('Bus', busSchema);
