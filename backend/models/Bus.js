const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
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
  seatsTotal: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Must have at least 1 seat']
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [0, 'Fare cannot be negative']
  },
  busType: {
    type: String,
    enum: ['standard', 'luxury', 'semi-luxury'],
    default: 'standard'
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'charging-ports', 'entertainment', 'refreshments']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  operator: {
    name: String,
    contact: String
  }
}, {
  timestamps: true
});

// Index for search queries
busSchema.index({ fromCity: 1, toCity: 1 });
busSchema.index({ name: 1 });

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
    fromCity: this.fromCity,
    toCity: this.toCity,
    departTime: this.departTime,
    arriveTime: this.arriveTime,
    seatsTotal: this.seatsTotal,
    fare: this.fare,
    busType: this.busType,
    amenities: this.amenities,
    operator: this.operator,
    isActive: this.isActive
  };
};

module.exports = mongoose.model('Bus', busSchema);
