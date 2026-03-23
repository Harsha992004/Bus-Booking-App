import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Users, 
  Bus, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';
import AdminAnalytics from '../components/AdminAnalytics';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const bookingStats = dashboardData?.bookingStats || {};
  const recentBookings = dashboardData?.recentBookings || [];
  const popularRoutes = dashboardData?.popularRoutes || [];

  const statCards = [
    {
      title: 'Total Buses',
      value: stats.totalBuses || 0,
      icon: Bus,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      icon: Ticket,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Recent Revenue',
      value: `$${(stats.recentRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+20%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.profile?.firstName || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Booking ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Passenger</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Route</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{booking.bookingReference}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{booking.passengerName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {booking.bus?.fromCity} → {booking.bus?.toCity}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          ${booking.totalFare}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'paid' ? 'bg-green-100 text-green-700' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {recentBookings.length === 0 && (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Routes</h2>
              
              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {route.from} → {route.to}
                        </p>
                        <p className="text-xs text-gray-600">{route.bookings} bookings</p>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                ))}
                
                {popularRoutes.length === 0 && (
                  <div className="text-center py-8">
                    <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No route data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full btn btn-primary text-left flex items-center justify-between">
                  <span>Add New Bus</span>
                  <Bus className="h-4 w-4" />
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center justify-between">
                  <span>Manage Bookings</span>
                  <Ticket className="h-4 w-4" />
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center justify-between">
                  <span>Export Reports</span>
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
