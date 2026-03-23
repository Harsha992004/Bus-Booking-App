import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { busesAPI, bookingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Bus, ArrowLeft, Users, Calendar, Clock, MapPin, DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import SeatSelector from '../components/SeatSelector';
import PaymentForm from '../components/PaymentForm';
import BusCard from '../components/BusCard';
import PassengerDetails from '../components/PassengerDetails';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bus, setBus] = useState(null);
  const [seatAvailability, setSeatAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Enhanced booking states
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('seats'); // 'seats', 'passengers', 'payment', 'confirmation'
  const [passengers, setPassengers] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  
  const searchParams = new URLSearchParams(window.location.search);
  const travelDate = searchParams.get('date');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      passengerName: user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : '',
      passengerEmail: user?.email || '',
      passengerPhone: user?.profile?.phone || '',
      seatsBooked: 1
    }
  });

  const seatsBooked = watch('seatsBooked');

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  const fetchBusDetails = async () => {
    setLoading(true);
    try {
      const response = await busesAPI.getBus(id);
      setBus(response.data.data.bus);
      
      if (travelDate) {
        const availabilityResponse = await busesAPI.getSeatAvailability(id, travelDate);
        setSeatAvailability(availabilityResponse.data.data);
      }
    } catch (error) {
      toast.error('Failed to load bus details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handlePassengerSubmit = (passengerData) => {
    setPassengers(passengerData);
    setBookingStep('payment');
  };

  const handlePaymentSuccess = (paymentData) => {
    const finalBookingData = {
      bus: bus,
      travelDate: travelDate,
      seats: selectedSeats,
      passengers: passengers,
      payment: paymentData,
      totalFare: calculateTotalFare()
    };
    
    setBookingData(finalBookingData);
    setBookingStep('confirmation');
    
    // Create booking in backend
    createBooking(finalBookingData);
  };

  const calculateTotalFare = () => {
    return selectedSeats.reduce((total, seat) => total + bus.fare, 0);
  };

  const createBooking = async (bookingData) => {
    setBookingLoading(true);
    try {
      const response = await bookingsAPI.createBooking(bookingData);
      toast.success('Booking confirmed successfully!');
      
      // Redirect to booking confirmation
      setTimeout(() => {
        navigate(`/my-bookings`);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
      setBookingStep('payment');
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setSelectedSeats([]);
    setPassengers([]);
    setBookingData(null);
    setBookingStep('seats');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bus not found</h3>
        <p className="text-gray-600">The bus you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Follow the steps to book your bus tickets</p>
        </div>

        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['seats', 'passengers', 'payment', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  bookingStep === step 
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : index < ['seats', 'passengers', 'payment', 'confirmation'].indexOf(bookingStep)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                }`}>
                  {index < ['seats', 'passengers', 'payment', 'confirmation'].indexOf(bookingStep) ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  bookingStep === step ? 'text-primary-600' :
                  index < ['seats', 'passengers', 'payment', 'confirmation'].indexOf(bookingStep) ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    index < ['seats', 'passengers', 'payment', 'confirmation'].indexOf(bookingStep)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bus Information */}
        <div className="mb-8">
          <BusCard bus={bus} onSelect={() => {}} isSelected={true} />
        </div>

        {/* Dynamic Content Based on Booking Step */}
        {bookingStep === 'seats' && (
          <div>
            <SeatSelector
              bus={bus}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              maxSeats={6}
              passengers={passengers}
            />
            
            {selectedSeats.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setBookingStep('passengers')}
                  className="btn btn-primary"
                >
                  Continue to Passenger Details
                </button>
              </div>
            )}
          </div>
        )}

        {bookingStep === 'passengers' && (
          <div>
            <PassengerDetails
              selectedSeats={selectedSeats}
              onPassengerSubmit={handlePassengerSubmit}
              bus={bus}
              travelDate={travelDate}
            />
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setBookingStep('seats')}
                className="btn btn-secondary"
              >
                Back to Seat Selection
              </button>
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div>
            <PaymentForm
              bookingData={{
                bus: bus,
                travelDate: travelDate,
                seats: selectedSeats,
                passengers: passengers,
                totalFare: calculateTotalFare()
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={() => setBookingStep('passengers')}
            />
          </div>
        )}

        {bookingStep === 'confirmation' && (
          <div className="text-center py-12">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </p>
            
            {bookingData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-green-900 mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">BK{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus:</span>
                    <span className="font-medium">{bookingData.bus.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">{bookingData.bus.fromCity} → {bookingData.bus.toCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(bookingData.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{bookingData.seats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{bookingData.passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-900">₹{bookingData.totalFare}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate('/my-bookings')}
                className="btn btn-primary"
              >
                View My Bookings
              </button>
              <button
                onClick={resetBooking}
                className="btn btn-secondary"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
