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
  bookingDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
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
  boardingPoint: {
    location: String,
    landmark: String,
    time: String
  },
  droppingPoint: {
    location: String,
    landmark: String,
    time: String
  },
  passengers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 0
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    seatNumber: {
      type: String,
      required: true
    },
    seatCategory: {
      type: String,
      enum: ['sleeper', 'semi-sleeper', 'seater', 'luxury']
    },
    idType: {
      type: String,
      enum: ['aadhaar', 'pan', 'passport', 'driving-license', 'voter-id']
    },
    idNumber: String,
    contact: String,
    specialRequirements: String
  }],
  primaryContact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
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
  seatCategory: {
    type: String,
    enum: ['sleeper', 'semi-sleeper', 'seater', 'luxury'],
    default: 'seater'
  },
  fareDetails: {
    baseFare: Number,
    taxes: {
      gst: Number,
      serviceTax: Number
    },
    discount: {
      couponCode: String,
      amount: Number
    },
    totalFare: {
      type: Number,
      required: [true, 'Total fare is required'],
      min: [0, 'Fare cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'cash']
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paymentReference: String,
    paidAt: Date
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  pnrNumber: {
    type: String,
    unique: true
  },
  ticketStatus: {
    type: String,
    enum: ['waitlist', 'confirmed', 'rac', 'cancelled'],
    default: 'confirmed'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  cancellationDetails: {
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    cancellationCharges: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  rescheduleDetails: {
    originalTravelDate: Date,
    newTravelDate: Date,
    rescheduledAt: Date,
    fareDifference: Number
  },
  notificationSent: {
    bookingConfirmation: { type: Boolean, default: false },
    paymentReminder: { type: Boolean, default: false },
    travelReminder: { type: Boolean, default: false },
    boardingReminder: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Generate booking reference and PNR before saving
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.bookingReference) {
    // Format: BMS-YYYYMMDD-XXXX (Book My Seat format)
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   String(date.getMonth() + 1).padStart(2, '0') + 
                   String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingReference = `BMS-${dateStr}-${random}`;
  }
  
  if (this.isNew && !this.pnrNumber) {
    // PNR format: 10 digit number
    this.pnrNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  
  // Calculate total fare from fareDetails
  if (this.fareDetails && !this.fareDetails.totalFare) {
    const base = this.fareDetails.baseFare || 0;
    const gst = this.fareDetails.taxes?.gst || 0;
    const serviceTax = this.fareDetails.taxes?.serviceTax || 0;
    const discount = this.fareDetails.discount?.amount || 0;
    this.fareDetails.totalFare = base + gst + serviceTax - discount;
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
    pnrNumber: this.pnrNumber,
    bus: this.bus,
    user: this.user,
    bookingDate: this.bookingDate,
    travelDate: this.travelDate,
    fromCity: this.fromCity,
    toCity: this.toCity,
    boardingPoint: this.boardingPoint,
    droppingPoint: this.droppingPoint,
    passengers: this.passengers,
    primaryContact: this.primaryContact,
    seatsBooked: this.seatsBooked,
    seatNumbers: this.seatNumbers,
    seatCategory: this.seatCategory,
    fareDetails: this.fareDetails,
    status: this.status,
    ticketStatus: this.ticketStatus,
    paymentStatus: this.paymentStatus,
    paymentMethod: this.paymentMethod,
    paymentDetails: this.paymentDetails,
    specialRequests: this.specialRequests,
    cancellationDetails: this.cancellationDetails,
    rescheduleDetails: this.rescheduleDetails,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to get seat availability for a bus on a specific date
bookingSchema.statics.getSeatAvailability = async function(busId, travelDate, fromCity, toCity) {
  const startOfDay = new Date(travelDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(travelDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Get all bookings for this bus on this date
  const bookings = await this.find({
    bus: new mongoose.Types.ObjectId(busId),
    travelDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'paid'] }
  }).select('seatNumbers fromCity toCity');

  // Get all booked seat numbers
  const bookedSeatNumbers = bookings.reduce((acc, booking) => {
    // If checking for specific route, filter relevant bookings
    if (fromCity && toCity) {
      // Check if this booking overlaps with requested route
      const bookingStops = [booking.fromCity, booking.toCity];
      if (bookingStops.includes(fromCity) || bookingStops.includes(toCity)) {
        return [...acc, ...booking.seatNumbers];
      }
      return acc;
    }
    return [...acc, ...booking.seatNumbers];
  }, []);
  
  const bus = await mongoose.model('Bus').findById(busId);
  if (!bus) {
    throw new Error('Bus not found');
  }

  // Get all seat numbers based on layout
  const allSeats = [];
  const categories = bus.seatCategories || [{ seats: bus.seatsTotal, seatNumbers: [] }];
  
  categories.forEach(cat => {
    if (cat.seatNumbers && cat.seatNumbers.length > 0) {
      allSeats.push(...cat.seatNumbers);
    } else {
      // Generate seat numbers if not defined
      for (let i = 1; i <= cat.seats; i++) {
        allSeats.push(`${cat.category?.charAt(0).toUpperCase() || 'S'}${i}`);
      }
    }
  });

  const availableSeats = allSeats.filter(seat => !bookedSeatNumbers.includes(seat));

  return {
    totalSeats: bus.seatsTotal,
    bookedSeats: bookedSeatNumbers.length,
    availableSeats: bus.seatsTotal - bookedSeatNumbers.length,
    bookedSeatNumbers,
    availableSeatNumbers: availableSeats,
    seatCategories: bus.seatCategories
  };
};

// Static method to cancel booking
bookingSchema.statics.cancelBooking = async function(bookingId, reason) {
  const booking = await this.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  // Calculate refund amount (implement your refund policy)
  const totalFare = booking.fareDetails?.totalFare || 0;
  const cancellationCharges = totalFare * 0.1; // 10% cancellation fee
  const refundAmount = totalFare - cancellationCharges;

  booking.status = 'cancelled';
  booking.ticketStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  booking.cancellationDetails = {
    reason,
    cancelledAt: new Date(),
    refundAmount,
    cancellationCharges,
    refundStatus: 'pending'
  };

  await booking.save();
  return booking;
};

module.exports = mongoose.model('Booking', bookingSchema);
