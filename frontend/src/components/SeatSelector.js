import React, { useState, useEffect } from 'react';
import { Check, X, Users, User, Info, AlertCircle } from 'lucide-react';

const SeatSelector = ({ bus, selectedSeats, onSeatSelect, maxSeats, passengers = [] }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [seatPrices, setSeatPrices] = useState({});
  const [genderPreferences, setGenderPreferences] = useState({});
  
  // Generate seat layout (4 seats per row with aisle)
  const generateSeatLayout = () => {
    const seats = [];
    const totalSeats = bus.seatsTotal;
    const rows = Math.ceil(totalSeats / 4);
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col + 1;
        if (seatNumber <= totalSeats) {
          rowSeats.push(seatNumber);
        }
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  // Generate dynamic pricing based on seat location
  useEffect(() => {
    const prices = {};
    const totalRows = Math.ceil(bus.seatsTotal / 4);
    
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col + 1;
        if (seatNumber <= bus.seatsTotal) {
          // Premium pricing for front rows and window seats
          let priceMultiplier = 1;
          if (row < 3) priceMultiplier = 1.2; // Front rows 20% premium
          if (col === 0 || col === 3) priceMultiplier *= 1.1; // Window seats 10% premium
          
          prices[seatNumber] = Math.round(bus.fare * priceMultiplier);
        }
      }
    }
    setSeatPrices(prices);
  }, [bus]);

  const getSeatStatus = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) return 'selected';
    if (bus.bookedSeats && bus.bookedSeats.includes(seatNumber)) return 'booked';
    return 'available';
  };

  const getSeatType = (col) => {
    if (col === 0 || col === 3) return 'window';
    if (col === 1 || col === 2) return 'aisle';
    return 'middle';
  };

  const handleSeatClick = (seatNumber) => {
    const status = getSeatStatus(seatNumber);
    if (status === 'booked') return;
    
    if (status === 'selected') {
      onSeatSelect(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect([...selectedSeats, seatNumber]);
    }
  };

  const handleGenderPreference = (seatNumber, gender) => {
    setGenderPreferences(prev => ({
      ...prev,
      [seatNumber]: gender
    }));
  };

  const getSeatColor = (status, seatType, seatNumber) => {
    const baseColor = {
      'selected': 'bg-blue-500 text-white border-blue-600',
      'booked': 'bg-red-100 text-red-600 border-red-300 cursor-not-allowed',
      'available': 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer',
    }[status];

    // Add gender preference styling
    if (genderPreferences[seatNumber]) {
      return baseColor.replace('border-gray-300', genderPreferences[seatNumber] === 'male' ? 'border-blue-400' : 'border-pink-400');
    }

    return baseColor;
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + (seatPrices[seat] || bus.fare), 0);
  };

  const getSeatLegend = () => {
    const availableCount = bus.seatsTotal - (bus.bookedSeats?.length || 0) - selectedSeats.length;
    const bookedCount = bus.bookedSeats?.length || 0;
    const selectedCount = selectedSeats.length;

    return [
      { color: 'bg-white border-gray-300', label: 'Available', count: availableCount },
      { color: 'bg-blue-500 text-white border-blue-600', label: 'Selected', count: selectedCount },
      { color: 'bg-red-100 text-red-600 border-red-300', label: 'Booked', count: bookedCount },
    ];
  };

  const seatLayout = generateSeatLayout();
  const selectedCount = selectedSeats.length;
  const totalPrice = calculateTotalPrice();

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Select Seats</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{selectedCount} of {maxSeats} seats selected</span>
        </div>
      </div>
      
      {/* Enhanced Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        {getSeatLegend().map((legend, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-6 h-6 ${legend.color} border-2 rounded`}></div>
            <span className="text-gray-700">{legend.label}</span>
            <span className="text-gray-500">({legend.count})</span>
          </div>
        ))}
      </div>

      {/* Bus Layout with Enhanced Features */}
      <div className="mb-6">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="text-center text-sm text-gray-600 font-medium mb-2">DRIVER</div>
        </div>
        
        {/* Seat Type Indicators */}
        <div className="flex justify-center space-x-8 mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Window</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Aisle</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center space-x-2">
              {/* Row Number */}
              <div className="w-8 text-center text-sm text-gray-500 font-medium">
                {rowIndex + 1}
              </div>
              
              {/* Seats */}
              {row.map((seatNumber, colIndex) => {
                const status = getSeatStatus(seatNumber);
                const seatType = getSeatType(colIndex);
                const price = seatPrices[seatNumber] || bus.fare;
                
                return (
                  <div key={seatNumber} className="relative">
                    <button
                      onClick={() => handleSeatClick(seatNumber)}
                      onMouseEnter={() => setHoveredSeat(seatNumber)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={status === 'booked'}
                      className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getSeatColor(status, seatType, seatNumber)}`}
                    >
                      {seatNumber}
                    </button>
                    
                    {/* Seat Type Indicator */}
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      seatType === 'window' ? 'bg-blue-100 border border-blue-300' :
                      seatType === 'aisle' ? 'bg-green-100 border border-green-300' :
                      'bg-gray-100 border border-gray-300'
                    }`}></div>
                    
                    {/* Hover Tooltip */}
                    {hoveredSeat === seatNumber && (
                      <div className="absolute z-10 bg-gray-900 text-white p-2 rounded-lg text-xs -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="font-medium">Seat {seatNumber}</div>
                        <div>Type: {seatType}</div>
                        <div>Price: ₹{price}</div>
                        {status === 'booked' && <div className="text-red-300">Already Booked</div>}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Row Number (right side) */}
              <div className="w-8 text-center text-sm text-gray-500 font-medium">
                {rowIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Preference Options */}
      {selectedSeats.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">Seat Preferences</h4>
            <div className="flex items-center space-x-2 text-blue-700">
              <Info className="h-4 w-4" />
              <span className="text-xs">Optional for safety</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedSeats.map((seatNumber, index) => (
              <div key={seatNumber} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">Seat {seatNumber}</span>
                  <span className="text-sm text-gray-600">₹{seatPrices[seatNumber] || bus.fare}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenderPreference(seatNumber, 'male')}
                    className={`px-3 py-1 text-xs rounded ${
                      genderPreferences[seatNumber] === 'male' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => handleGenderPreference(seatNumber, 'female')}
                    className={`px-3 py-1 text-xs rounded ${
                      genderPreferences[seatNumber] === 'female' 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    onClick={() => handleGenderPreference(seatNumber, null)}
                    className={`px-3 py-1 text-xs rounded ${
                      !genderPreferences[seatNumber] 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    Any
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">
              {selectedCount} of {maxSeats} seats selected
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Base Fare: ₹{bus.fare} per seat</p>
            <p className="text-lg font-bold text-gray-900">Total: ₹{totalPrice}</p>
            {totalPrice > selectedCount * bus.fare && (
              <p className="text-xs text-orange-600">Includes premium seat charges</p>
            )}
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Selected Seats</p>
                <p className="text-xs text-green-700">
                  {selectedSeats.map(seat => `Seat ${seat} (₹{seatPrices[seat] || bus.fare})`).join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-900">Total Amount</p>
                <p className="text-lg font-bold text-green-900">₹{totalPrice}</p>
              </div>
            </div>
          </div>
        )}

        {selectedCount === 0 && (
          <p className="text-gray-500 text-sm text-center">
            Please select at least one seat to continue
          </p>
        )}

        {/* Seat Availability Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Real-time seat availability. Seats marked in red are already booked.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
