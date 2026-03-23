import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Bus, 
  Calendar,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAnalytics(timeRange);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const getChangeColor = (value) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeIcon = (value) => {
    return value > 0 ? ArrowUp : value < 0 ? ArrowDown : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics?.totalRevenue || 0),
      change: analytics?.revenueChange || 0,
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      change: analytics?.bookingsChange || 0,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: analytics?.activeUsers || 0,
      change: analytics?.usersChange || 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Buses',
      value: analytics?.activeBuses || 0,
      change: analytics?.busesChange || 0,
      icon: Bus,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = getChangeIcon(stat.change);
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                {ChangeIcon && (
                  <div className={`flex items-center space-x-1 ${getChangeColor(stat.change)}`}>
                    <ChangeIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatPercentage(stat.change)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Revenue chart would be displayed here</p>
              <p className="text-sm text-gray-500">Integration with Chart.js recommended</p>
            </div>
          </div>
        </div>

        {/* Bookings by Route */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Routes</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics?.popularRoutes?.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{route.route}</p>
                  <p className="text-sm text-gray-600">{route.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(route.revenue)}</p>
                  <p className="text-sm text-gray-600">revenue</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No route data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {analytics?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'booking' ? 'bg-green-500' :
                activity.type === 'cancellation' ? 'bg-red-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {analytics?.occupancyRate || 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${analytics?.occupancyRate || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Average bus occupancy</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics?.satisfactionScore || 0}/5
            </div>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(analytics?.satisfactionScore || 0) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Average rating</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">On-Time Performance</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics?.onTimePerformance || 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analytics?.onTimePerformance || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Buses on schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
