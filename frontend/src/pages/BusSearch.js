import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { busesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Search, Bus, Clock, DollarSign, Users, Calendar, Filter } from 'lucide-react';
import BusCard from '../components/BusCard';

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      date: searchParams.get('date') || ''
    }
  });

  const watchedFrom = watch('from');
  const watchedTo = watch('to');

  // Fetch location suggestions
  useEffect(() => {
    const fetchLocations = async (query, field) => {
      if (query.length < 2) return;
      
      try {
        const response = await busesAPI.getLocations(query);
        setLocations(prev => ({ ...prev, [field]: response.data.data.cities }));
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (watchedFrom) {
      fetchLocations(watchedFrom, 'from');
    }
    if (watchedTo) {
      fetchLocations(watchedTo, 'to');
    }
  }, [watchedFrom, watchedTo]);

  // Search buses
  const onSearch = async (data) => {
    setLoading(true);
    try {
      const response = await busesAPI.getBuses(data);
      setBuses(response.data.data.buses);
      
      if (response.data.data.buses.length === 0) {
        toast.info('No buses found for your search criteria');
      }
    } catch (error) {
      toast.error('Failed to search buses. Please try again.');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Book bus
  const handleBookBus = (bus) => {
    // Navigate to booking page with bus details
    window.location.href = `/booking/${bus.id}?date=${watch('date')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Search Form */}
        <div className="card p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Buses</h1>
          
          <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  {...register('from', { required: 'Departure city is required' })}
                  type="text"
                  className="input"
                  placeholder="Departure city"
                  list="from-locations"
                />
                {locations.from?.length > 0 && (
                  <datalist id="from-locations">
                    {locations.from.map((city, index) => (
                      <option key={index} value={city} />
                    ))}
                  </datalist>
                )}
                {errors.from && (
                  <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
                )}
              </div>

              {/* To */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  {...register('to', { required: 'Destination city is required' })}
                  type="text"
                  className="input"
                  placeholder="Destination city"
                  list="to-locations"
                />
                {locations.to?.length > 0 && (
                  <datalist id="to-locations">
                    {locations.to.map((city, index) => (
                      <option key={index} value={city} />
                    ))}
                  </datalist>
                )}
                {errors.to && (
                  <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <input
                  {...register('date', { required: 'Travel date is required' })}
                  type="date"
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>

            {/* Filters Toggle */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-500"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bus Type
                    </label>
                    <select className="input">
                      <option value="">All Types</option>
                      <option value="standard">Standard</option>
                      <option value="semi-luxury">Semi-Luxury</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select className="input">
                      <option value="">Any Price</option>
                      <option value="0-50">$0 - $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100+">$100+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select className="input">
                      <option value="departure">Departure Time</option>
                      <option value="price">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {buses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Found {buses.length} buses
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {buses.map((bus) => (
                <BusCard 
                  key={bus.id} 
                  bus={bus} 
                  onSelect={(selectedBus) => handleBookBus(selectedBus)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && buses.length === 0 && (watch('from') || watch('to')) && (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or dates</p>
          </div>
        )}

        {/* Initial State */}
        {!watch('from') && !watch('to') && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for buses</h3>
            <p className="text-gray-600">Enter your travel details to find available buses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSearch;
