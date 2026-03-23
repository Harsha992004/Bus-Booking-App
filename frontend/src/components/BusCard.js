import React from 'react';
import { Bus, Clock, MapPin, Users, DollarSign, Star } from 'lucide-react';

const BusCard = ({ bus, onSelect, isSelected = false }) => {
  const getBusTypeColor = (type) => {
    switch (type) {
      case 'luxury': return 'bg-purple-100 text-purple-700';
      case 'semi-luxury': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBusTypeLabel = (type) => {
    switch (type) {
      case 'luxury': return 'Luxury';
      case 'semi-luxury': return 'Semi-Luxury';
      default: return 'Standard';
    }
  };

  const availableSeats = bus.seatsTotal - (bus.bookedSeats?.length || 0);
  const occupancyRate = ((bus.seatsTotal - availableSeats) / bus.seatsTotal) * 100;

  return (
    <div className={`card p-4 hover:shadow-lg transition-all cursor-pointer ${
      isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
    }`} onClick={() => onSelect(bus)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Bus className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">{bus.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getBusTypeColor(bus.busType)}`}>
              {getBusTypeLabel(bus.busType)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{bus.rating || '4.5'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{availableSeats} seats left</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">${bus.fare}</div>
          <div className="text-xs text-gray-500">per seat</div>
        </div>
      </div>

      {/* Route Information */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">{bus.fromCity}</div>
              <div className="text-sm text-gray-600">{bus.departTime}</div>
            </div>
          </div>
          
          <div className="flex-1 px-4">
            <div className="relative">
              <div className="border-t-2 border-dashed border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              {bus.duration || '4h 30m'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="font-medium text-gray-900">{bus.toCity}</div>
              <div className="text-sm text-gray-600">{bus.arriveTime}</div>
            </div>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Amenities */}
        {bus.amenities && bus.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            {bus.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {amenity}
              </span>
            ))}
            {bus.amenities.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{bus.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Seat Occupancy Bar */}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Seat Occupancy</span>
            <span className="text-xs font-medium text-gray-900">{Math.round(occupancyRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                occupancyRate > 80 ? 'bg-red-500' : 
                occupancyRate > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Select Button */}
      <div className="mt-4 pt-4 border-t">
        <button className="btn btn-primary w-full">
          Select Bus
        </button>
      </div>
    </div>
  );
};

export default BusCard;
