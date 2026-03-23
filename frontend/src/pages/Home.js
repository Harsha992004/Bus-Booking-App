import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bus, Shield, Clock, CreditCard, Users, ArrowRight } from 'lucide-react';

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
      icon: Search,
      title: 'Easy Search',
      description: 'Find buses quickly with our advanced search filters'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your personal and payment information is always secure'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant updates on bus schedules and availability'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Choose from various payment methods for your convenience'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Our customer support team is always here to help'
    },
    {
      icon: Bus,
      title: 'Wide Network',
      description: 'Access buses from multiple operators across the country'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-fade-in">
              Book bus tickets online with ease and comfort
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900 animate-slide-up">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={searchForm.from}
                    onChange={handleInputChange}
                    placeholder="Departure city"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={searchForm.to}
                    onChange={handleInputChange}
                    placeholder="Arrival city"
                    className="input"
                    required
                  />
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
              Why Choose BusBooking?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make bus travel simple, affordable, and enjoyable for everyone
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied travelers who trust BusBooking for their travel needs
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
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-200">Bus Routes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-200">Bus Partners</div>
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
