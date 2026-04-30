const mongoose = require('mongoose');

// Predefined Andhra Pradesh cities
const ANDHRA_CITIES = [
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
  'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur',
  'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam',
  'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 'Proddatur',
  'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Srikakulam',
  'Tadepalligudem', 'Narasaraopet', 'Palakollu', 'Tadipatri', 'Chirala'
];

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source city is required'],
    trim: true,
    enum: ANDHRA_CITIES
  },
  destination: {
    type: String,
    required: [true, 'Destination city is required'],
    trim: true,
    enum: ANDHRA_CITIES
  },
  intermediateStops: [{
    city: {
      type: String,
      trim: true,
      enum: ANDHRA_CITIES
    },
    arrivalTime: String,
    departureTime: String,
    fareFromSource: Number
  }],
  distance: {
    type: Number, // in kilometers
    required: true
  },
  duration: {
    type: String, // estimated travel time
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get all Andhra Pradesh cities
routeSchema.statics.getAndhraCities = function() {
  return ANDHRA_CITIES;
};

// Method to get formatted route data
routeSchema.methods.getFormattedData = function() {
  return {
    id: this._id,
    name: this.name,
    source: this.source,
    destination: this.destination,
    intermediateStops: this.intermediateStops,
    distance: this.distance,
    duration: this.duration,
    isActive: this.isActive
  };
};

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
module.exports.ANDHRA_CITIES = ANDHRA_CITIES;
