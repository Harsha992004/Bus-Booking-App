import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Clock, Route, Bus } from 'lucide-react';
import { routesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const PopularRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');

  useEffect(() => {
    fetchPopularRoutes();
    fetchCities();
  }, []);

  const fetchPopularRoutes = async () => {
    try {
      const response = await routesAPI.getPopularRoutes();
      setRoutes(response.data.data.routes || []);
    } catch (error) {
      toast.error('Failed to load popular routes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await routesAPI.getCities();
      setCities(response.data.data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSearchRoute = () => {
    if (selectedFrom && selectedTo) {
      window.location.href = `/search?from=${selectedFrom}&to=${selectedTo}`;
    } else {
      toast.error('Please select both from and to cities');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Popular Routes</h1>
          <p className="text-gray-600">Explore the most traveled bus routes in Andhra Pradesh</p>
        </div>

        {/* Route Search */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From City
              </label>
              <select
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                className="input"
              >
                <option value="">Select departure</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To City
              </label>
              <select
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                className="input"
              >
                <option value="">Select destination</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSearchRoute}
              className="btn btn-primary flex items-center justify-center space-x-2"
            >
              <span>Search Buses</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Popular Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/search?from=${route.source}&to=${route.destination}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Route className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.source}</h3>
                    <p className="text-sm text-gray-500">to</p>
                    <h3 className="font-semibold text-gray-900">{route.destination}</h3>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{route.distance} km</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{route.duration}</span>
                </div>
              </div>

              {route.stops && route.stops.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Via: {route.stops.join(', ')}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-primary-600 font-semibold">
                  Starting from ₹{route.baseFare}
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Bus className="h-4 w-4" />
                  <span>4 buses daily</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Can't find your route?</h2>
            <p className="text-primary-100 mb-6">
              We cover 30+ cities across Andhra Pradesh. Use our search to find buses for any route.
            </p>
            <button
              onClick={() => window.location.href = '/search'}
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Search All Routes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularRoutes;
