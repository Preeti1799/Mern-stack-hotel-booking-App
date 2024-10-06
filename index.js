import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './api/routes/auth.js';
import usersRoute from './api/routes/users.js';
import hotelsRoute from './api/routes/hotels.js';
import roomsRoute from './api/routes/rooms.js';
import bookingRoute from './api/routes/booking.js'; // Import booking routes

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(process.env.PORT || 8800, () => {
    console.log('Server is running on port 8800');
  });
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/bookings', bookingRoute); // Add booking routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});
