import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bus, Shield, Clock, CreditCard, Users, ArrowRight, Armchair, MapPin, Star } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: ''
  });

  const handleInputChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search page with query params
    const params = new URLSearchParams(searchForm);
    window.location.href = `/search?${params.toString()}`;
  };

  const features = [
    {
      icon: MapPin,
      title: '30+ Cities Covered',
      description: 'Book tickets across all major cities in Andhra Pradesh'
    },
    {
      icon: Armchair,
      title: 'Choose Your Seat',
      description: 'Select preferred seats - Sleeper, Semi-Sleeper, or Seater'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Safe and secure payment with instant confirmation'
    },
    {
      icon: Clock,
      title: 'Live Tracking',
      description: 'Real-time bus location and arrival updates'
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'UPI, Cards, Net Banking - All payment modes accepted'
    },
    {
      icon: Star,
      title: 'Best Fares',
      description: 'Competitive pricing with special discounts for regular travelers'
    }
  ];

  // Andhra Pradesh popular cities
  const popularCities = [
    'Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 
    'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Book My Seat
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-100 animate-fade-in">
              Andhra Pradesh State Transport Corporation
            </p>
            <p className="text-lg mb-8 text-primary-200 animate-fade-in">
              Book bus tickets across 30+ cities in Andhra Pradesh. Safe, Fast & Reliable.
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900 animate-slide-up">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From City
                  </label>
                  <select
                    name="from"
                    value={searchForm.from}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select departure</option>
                    {popularCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To City
                  </label>
                  <select
                    name="to"
                    value={searchForm.to}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select destination</option>
                    {popularCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={searchForm.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Buses</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Book My Seat?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The official online booking platform for Andhra Pradesh State Transport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Travel Across Andhra Pradesh
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join millions of travelers who trust Book My Seat for safe and comfortable journeys
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/search"
                  className="btn btn-secondary text-lg px-8 py-3"
                >
                  Browse Buses
                </Link>
              </div>
            ) : (
              <Link
                to="/search"
                className="btn btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Search Buses</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">30+</div>
              <div className="text-primary-200">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-200">Daily Services</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1M+</div>
              <div className="text-primary-200">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-200">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
