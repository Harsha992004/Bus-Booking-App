import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Ticket, Search, Filter, Download, Eye, DollarSign, X, Check } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    payment: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getBookings(filters);
      setBookings(response.data.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchBookings();
  };

  const handleExportBookings = async () => {
    try {
      const response = await adminAPI.exportBookings();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Bookings exported successfully');
    } catch (error) {
      toast.error('Failed to export bookings');
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleUpdatePayment = async (bookingId, paymentStatus) => {
    try {
      await adminAPI.updatePaymentStatus(bookingId, paymentStatus);
      toast.success('Payment status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600 mt-2">View and manage all customer bookings</p>
          </div>
          <button
            onClick={handleExportBookings}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={filters.payment}
                onChange={(e) => handleFilterChange('payment', e.target.value)}
                className="input"
              >
                <option value="">All Payment</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={handleSearch} className="btn btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Passenger</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Ticket className="h-4 w-4 text-primary-600" />
                        <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.passengerName}</p>
                        <p className="text-sm text-gray-600">{booking.passengerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {booking.bus?.fromCity} → {booking.bus?.toCity}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ${booking.totalFare}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'paid')}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Paid"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel Booking"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {booking.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdatePayment(booking.id, 'paid')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Mark Payment as Paid"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
