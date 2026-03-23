const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true
  },
  passengerPhone: {
    type: String,
    required: [true, 'Passenger phone is required'],
    trim: true
  },
  passengerEmail: {
    type: String,
    required: [true, 'Passenger email is required'],
    trim: true,
    lowercase: true
  },
  seatsBooked: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Must book at least 1 seat']
  },
  seatNumbers: [{
    type: String,
    trim: true
  }],
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  totalFare: {
    type: Number,
    required: [true, 'Total fare is required'],
    min: [0, 'Fare cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentReference: {
    type: String,
    trim: true
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  specialRequests: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: Date,
  paidAt: Date
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Index for user bookings
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bus: 1, travelDate: 1 });
bookingSchema.index({ bookingReference: 1 });

// Method to get formatted booking data
bookingSchema.methods.getFormattedData = function() {
  return {
    id: this._id,
    bookingReference: this.bookingReference,
    bus: this.bus,
    user: this.user,
    passengerName: this.passengerName,
    passengerPhone: this.passengerPhone,
    passengerEmail: this.passengerEmail,
    seatsBooked: this.seatsBooked,
    seatNumbers: this.seatNumbers,
    travelDate: this.travelDate,
    totalFare: this.totalFare,
    status: this.status,
    paymentStatus: this.paymentStatus,
    paymentReference: this.paymentReference,
    specialRequests: this.specialRequests,
    createdAt: this.createdAt,
    cancelledAt: this.cancelledAt,
    paidAt: this.paidAt
  };
};

// Static method to get seat availability for a bus on a specific date
bookingSchema.statics.getSeatAvailability = async function(busId, travelDate) {
  const bookedSeats = await this.aggregate([
    {
      $match: {
        bus: new mongoose.Types.ObjectId(busId),
        travelDate: new Date(travelDate),
        status: { $in: ['confirmed', 'paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalBooked: { $sum: '$seatsBooked' }
      }
    }
  ]);

  const totalBooked = bookedSeats.length > 0 ? bookedSeats[0].totalBooked : 0;
  
  const bus = await mongoose.model('Bus').findById(busId);
  if (!bus) {
    throw new Error('Bus not found');
  }

  return {
    totalSeats: bus.seatsTotal,
    bookedSeats: totalBooked,
    availableSeats: bus.seatsTotal - totalBooked
  };
};

module.exports = mongoose.model('Booking', bookingSchema);
