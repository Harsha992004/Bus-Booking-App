import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { busesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Bus, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await busesAPI.getBuses();
      setBuses(response.data.data.buses);
    } catch (error) {
      toast.error('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) {
      return;
    }

    try {
      await busesAPI.deleteBus(busId);
      toast.success('Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      toast.error('Failed to delete bus');
    }
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setShowForm(true);
  };

  const filteredBuses = buses.filter(bus =>
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Manage Buses</h1>
            <p className="text-gray-600 mt-2">Add, edit, and remove buses from your fleet</p>
          </div>
          <button
            onClick={() => {
              setEditingBus(null);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Bus</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search buses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <button className="btn btn-secondary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Buses Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bus Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Schedule</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Seats</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fare</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus) => (
                  <tr key={bus.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Bus className="h-4 w-4 text-primary-600" />
                        <span className="font-medium text-gray-900">{bus.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {bus.fromCity} → {bus.toCity}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {bus.departTime} - {bus.arriveTime}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{bus.seatsTotal}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">${bus.fare}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {bus.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBus(bus)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBuses.length === 0 && (
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No buses found</p>
              </div>
            )}
          </div>
        </div>

        {/* Bus Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingBus ? 'Edit Bus' : 'Add New Bus'}
                </h2>
                
                <BusForm
                  bus={editingBus}
                  onSubmit={() => {
                    setShowForm(false);
                    fetchBuses();
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Bus Form Component
const BusForm = ({ bus, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: bus || {}
  });

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (bus) {
        await busesAPI.updateBus(bus.id, data);
        toast.success('Bus updated successfully');
      } else {
        await busesAPI.createBus(data);
        toast.success('Bus created successfully');
      }
      onSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bus Name</label>
          <input
            {...register('name', { required: 'Bus name is required' })}
            className="input"
            placeholder="Enter bus name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bus Type</label>
          <select {...register('busType')} className="input">
            <option value="standard">Standard</option>
            <option value="semi-luxury">Semi-Luxury</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From City</label>
          <input
            {...register('fromCity', { required: 'From city is required' })}
            className="input"
            placeholder="Departure city"
          />
          {errors.fromCity && <p className="text-red-500 text-sm">{errors.fromCity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To City</label>
          <input
            {...register('toCity', { required: 'To city is required' })}
            className="input"
            placeholder="Destination city"
          />
          {errors.toCity && <p className="text-red-500 text-sm">{errors.toCity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
          <input
            {...register('departTime', { required: 'Departure time is required' })}
            className="input"
            placeholder="e.g., 08:00"
          />
          {errors.departTime && <p className="text-red-500 text-sm">{errors.departTime.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
          <input
            {...register('arriveTime', { required: 'Arrival time is required' })}
            className="input"
            placeholder="e.g., 12:00"
          />
          {errors.arriveTime && <p className="text-red-500 text-sm">{errors.arriveTime.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
          <input
            {...register('seatsTotal', { required: 'Total seats is required', min: 1 })}
            type="number"
            className="input"
            placeholder="Number of seats"
          />
          {errors.seatsTotal && <p className="text-red-500 text-sm">{errors.seatsTotal.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fare ($)</label>
          <input
            {...register('fare', { required: 'Fare is required', min: 0 })}
            type="number"
            step="0.01"
            className="input"
            placeholder="Ticket price"
          />
          {errors.fare && <p className="text-red-500 text-sm">{errors.fare.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : (bus ? 'Update Bus' : 'Create Bus')}
        </button>
      </div>
    </form>
  );
};

export default AdminBuses;
