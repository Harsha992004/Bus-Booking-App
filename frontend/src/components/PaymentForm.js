import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, Shield, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentForm = ({ bookingData, onPaymentSuccess, onPaymentCancel }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: CreditCard },
    { id: 'netbanking', name: 'Net Banking', icon: CreditCard },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would call payment API
      const paymentResponse = {
        success: true,
        transactionId: 'TXN' + Date.now(),
        amount: bookingData.totalFare,
        method: selectedMethod
      };
      
      toast.success('Payment successful!');
      onPaymentSuccess(paymentResponse);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <Shield className="h-5 w-5" />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bus:</span>
            <span className="font-medium">{bookingData.bus?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{bookingData.bus?.fromCity} → {bookingData.bus?.toCity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date(bookingData.travelDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats:</span>
            <span className="font-medium">{bookingData.seats?.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Passengers:</span>
            <span className="font-medium">{bookingData.passengers?.length}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="font-bold text-lg text-primary-600">${bookingData.totalFare}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Select Payment Method</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{method.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {selectedMethod === 'card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                {...register('cardNumber', {
                  required: 'Card number is required',
                  pattern: {
                    value: /^\d{16}$/,
                    message: 'Please enter a valid 16-digit card number'
                  }
                })}
                type="text"
                placeholder="1234 5678 9012 3456"
                className="input"
                maxLength="16"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  {...register('expiry', {
                    required: 'Expiry date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: 'Please enter a valid expiry date (MM/YY)'
                    }
                  })}
                  type="text"
                  placeholder="MM/YY"
                  className="input"
                />
                {errors.expiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  {...register('cvv', {
                    required: 'CVV is required',
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: 'Please enter a valid CVV'
                    }
                  })}
                  type="text"
                  placeholder="123"
                  className="input"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                {...register('cardholderName', {
                  required: 'Cardholder name is required'
                })}
                type="text"
                placeholder="John Doe"
                className="input"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
              )}
            </div>
          </>
        )}

        {selectedMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              {...register('upiId', {
                required: 'UPI ID is required',
                pattern: {
                  value: /^[\w.-]+@[\w.-]+$/,
                  message: 'Please enter a valid UPI ID'
                }
              })}
              type="text"
              placeholder="yourname@upi"
              className="input"
            />
            {errors.upiId && (
              <p className="mt-1 text-sm text-red-600">{errors.upiId.message}</p>
            )}
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <select
              {...register('bank', { required: 'Please select a bank' })}
              className="input"
            >
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="pnb">Punjab National Bank</option>
            </select>
            {errors.bank && (
              <p className="mt-1 text-sm text-red-600">{errors.bank.message}</p>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onPaymentCancel}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Pay ${bookingData.totalFare}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
