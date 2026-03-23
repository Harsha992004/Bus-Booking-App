import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Ticket, Calendar, DollarSign, Eye, X, Check } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getBookings();
      setBookings(response.data.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancelBooking(bookingId, 'Cancelled by user');
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handlePayBooking = async (bookingId) => {
    try {
      await bookingsAPI.payBooking(bookingId, `PAY${Date.now()}`);
      toast.success('Payment processed successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your bus bookings</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'confirmed', 'paid', 'cancelled', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Booking Reference: {booking.bookingReference}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-medium text-gray-900">
                          {booking.bus?.fromCity} → {booking.bus?.toCity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Travel Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Passenger</p>
                        <p className="font-medium text-gray-900">{booking.passengerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Seats</p>
                        <p className="font-medium text-gray-900">
                          {booking.seatsBooked} seat(s) - ${booking.totalFare}
                        </p>
                      </div>
                    </div>

                    {/* Bus Details */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Ticket className="h-4 w-4" />
                        <span>{booking.bus?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.bus?.departTime} - {booking.bus?.arriveTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                    <button className="btn btn-secondary flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    
                    {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                      <button
                        onClick={() => handlePayBooking(booking.id)}
                        className="btn btn-primary flex items-center space-x-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>Pay Now</span>
                      </button>
                    )}
                    
                    {['confirmed', 'pending'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn btn-danger flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't made any bookings yet" 
                : `No ${filter} bookings found`}
            </p>
            <button
              onClick={() => window.location.href = '/search'}
              className="btn btn-primary"
            >
              Search Buses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
