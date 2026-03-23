import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Calendar, Plus, X, AlertCircle, Check } from 'lucide-react';

const PassengerDetails = ({ selectedSeats, onPassengerSubmit, bus, travelDate }) => {
  const [passengers, setPassengers] = useState([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  
  // Initialize passengers array when seats are selected
  useEffect(() => {
    const initialPassengers = selectedSeats.map((seat, index) => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      idType: 'aadhaar',
      idNumber: ''
    }));
    setPassengers(initialPassengers);
  }, [selectedSeats]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm();

  const currentPassenger = passengers[currentPassengerIndex] || {};
  const isLastPassenger = currentPassengerIndex === selectedSeats.length - 1;

  const updatePassenger = (field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[currentPassengerIndex] = {
      ...updatedPassengers[currentPassengerIndex],
      [field]: value
    };
    setPassengers(updatedPassengers);
    setValue(field, value);
  };

  const nextPassenger = async () => {
    const isValid = await trigger();
    if (isValid && currentPassengerIndex < selectedSeats.length - 1) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
    }
  };

  const previousPassenger = () => {
    if (currentPassengerIndex > 0) {
      setCurrentPassengerIndex(currentPassengerIndex - 1);
    }
  };

  const removePassenger = (index) => {
    if (selectedSeats.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
      if (currentPassengerIndex >= updatedPassengers.length) {
        setCurrentPassengerIndex(updatedPassengers.length - 1);
      }
    }
  };

  const onSubmit = (data) => {
    // Update all passengers with form data
    const updatedPassengers = passengers.map((passenger, index) => ({
      ...passenger,
      ...data
    }));
    
    onPassengerSubmit(updatedPassengers);
  };

  const calculateTotalFare = () => {
    return selectedSeats.reduce((total, seat) => total + bus.fare, 0);
  };

  const idTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'voter', label: 'Voter ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving', label: 'Driving License' }
  ];

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Passenger Details</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{currentPassengerIndex + 1} of {selectedSeats.length} passengers</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Passenger Progress</span>
          <span className="text-sm text-gray-600">{currentPassengerIndex + 1}/{selectedSeats.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPassengerIndex + 1) / selectedSeats.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Passenger Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {passengers.map((passenger, index) => (
          <button
            key={index}
            onClick={() => setCurrentPassengerIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              index === currentPassengerIndex
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>Seat {passenger.seatNumber}</span>
              {passenger.name && <Check className="h-3 w-3" />}
            </div>
          </button>
        ))}
      </div>

      {/* Passenger Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">Seat {currentPassenger.seatNumber} Details</h4>
          </div>
          <p className="text-sm text-blue-700">Please enter passenger details for seat {currentPassenger.seatNumber}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                type="text"
                placeholder="Enter full name"
                className="input pl-10"
                value={currentPassenger.name || ''}
                onChange={(e) => updatePassenger('name', e.target.value)}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 1, message: 'Age must be at least 1' },
                  max: { value: 120, message: 'Age must be less than 120' }
                })}
                type="number"
                placeholder="Enter age"
                className="input pl-10"
                value={currentPassenger.age || ''}
                onChange={(e) => updatePassenger('age', e.target.value)}
              />
            </div>
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <div className="flex space-x-4">
              {['male', 'female', 'other'].map((gender) => (
                <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    {...register('gender', { required: 'Gender is required' })}
                    type="radio"
                    value={gender}
                    checked={currentPassenger.gender === gender}
                    onChange={(e) => updatePassenger('gender', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 capitalize">{gender}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                type="tel"
                placeholder="Enter 10-digit phone number"
                className="input pl-10"
                value={currentPassenger.phone || ''}
                onChange={(e) => updatePassenger('phone', e.target.value)}
                maxLength="10"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                placeholder="Enter email address"
                className="input pl-10"
                value={currentPassenger.email || ''}
                onChange={(e) => updatePassenger('email', e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* ID Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type *
            </label>
            <select
              {...register('idType', { required: 'ID type is required' })}
              className="input"
              value={currentPassenger.idType || 'aadhaar'}
              onChange={(e) => updatePassenger('idType', e.target.value)}
            >
              {idTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.idType && (
              <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
            )}
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number *
            </label>
            <input
              {...register('idNumber', {
                required: 'ID number is required',
                minLength: { value: 8, message: 'ID number must be at least 8 characters' }
              })}
              type="text"
              placeholder="Enter ID number"
              className="input"
              value={currentPassenger.idNumber || ''}
              onChange={(e) => updatePassenger('idNumber', e.target.value)}
            />
            {errors.idNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.idNumber.message}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentPassengerIndex > 0 && (
              <button
                type="button"
                onClick={previousPassenger}
                className="btn btn-secondary"
              >
                Previous Passenger
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            {currentPassengerIndex < selectedSeats.length - 1 ? (
              <button
                type="button"
                onClick={nextPassenger}
                className="btn btn-primary"
              >
                Next Passenger
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Booking Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bus:</span>
            <span className="font-medium">{bus.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{bus.fromCity} → {bus.toCity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date(travelDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats:</span>
            <span className="font-medium">{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Passengers:</span>
            <span className="font-medium">{selectedSeats.length}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="font-bold text-lg text-primary-600">₹{calculateTotalFare()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
