# Bus Booking System - MERN Stack

A modern bus booking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Project Structure

```
bus-booking-mern/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express API server
└── README.md         # This file
```

## Features

- User authentication (register, login, password reset)
- Bus search and filtering
- Online booking system
- Admin dashboard for bus management
- Booking management and payment tracking
- Responsive design
- Real-time seat availability

## Technology Stack

### Frontend
- React 18
- React Router
- Axios for API calls
- Tailwind CSS for styling
- React Hook Form for form handling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Database
- MongoDB for data storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables (see .env.example files)

5. Start the development servers:
   ```bash
   # Backend (port 5000)
   cd backend
   npm run dev

   # Frontend (port 3000)
   cd frontend
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/forgot-password - Password reset request

### Buses
- GET /api/buses - Get all buses with filtering
- GET /api/buses/:id - Get specific bus details
- POST /api/buses - Create new bus (admin)
- PUT /api/buses/:id - Update bus (admin)
- DELETE /api/buses/:id - Delete bus (admin)

### Bookings
- GET /api/bookings - Get user bookings
- POST /api/bookings - Create new booking
- PUT /api/bookings/:id/pay - Mark booking as paid
- PUT /api/bookings/:id/cancel - Cancel booking

### Admin
- GET /api/admin/dashboard - Admin dashboard data
- GET /api/admin/bookings - All bookings (admin)
- GET /api/admin/export/buses - Export buses CSV
- GET /api/admin/export/bookings - Export bookings CSV

## License

MIT License
