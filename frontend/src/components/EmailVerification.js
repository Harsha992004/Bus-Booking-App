import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';

const EmailVerification = ({ email, onVerified, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Timer for resend
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyEmail(email, data.code);
      toast.success('Email verified successfully!');
      onVerified();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendVerification(email);
      setResent(true);
      setTimeLeft(60);
      toast.success('Verification code sent again!');
    } catch (error) {
      toast.error('Failed to resend verification code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to<br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Verification Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                {...register('code', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Please enter a 6-digit code'
                  }
                })}
                type="text"
                placeholder="Enter 6-digit code"
                className="input text-center text-lg tracking-widest"
                maxLength="6"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {timeLeft > 0 
                  ? `Resend code in ${timeLeft}s` 
                  : 'Resend verification code'
                }
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Email
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success Message */}
          {resent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                Verification code has been resent to your email
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to login</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
