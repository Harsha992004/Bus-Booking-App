import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (email, otp) => api.post('/auth/verify-email', { email, otp }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

// Buses API
export const busesAPI = {
  getBuses: (params) => api.get('/buses', { params }),
  getBus: (id) => api.get(`/buses/${id}`),
  getSeatAvailability: (id, date) => api.get(`/buses/${id}/seats`, { params: { date } }),
  getLocations: (query) => api.get('/buses/locations/cities', { params: { q: query } }),
  createBus: (busData) => api.post('/buses', busData),
  updateBus: (id, busData) => api.put(`/buses/${id}`, busData),
  deleteBus: (id) => api.delete(`/buses/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  payBooking: (id, paymentReference) => api.put(`/bookings/${id}/pay`, { paymentReference }),
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus, paymentReference) => 
    api.put(`/admin/bookings/${id}/payment`, { paymentStatus, paymentReference }),
  releaseSeats: (id) => api.put(`/admin/bookings/${id}/release-seats`),
  exportBuses: () => api.get('/admin/export/buses', { responseType: 'blob' }),
  exportBookings: () => api.get('/admin/export/bookings', { responseType: 'blob' }),
};

export default api;
