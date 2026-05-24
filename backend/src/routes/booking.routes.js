const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authUserMiddleware, authCommonMiddleware, authSproviderMiddleware } = require('../middlewares/auth.middleware');

// Create booking (user only)
router.post('/', authUserMiddleware, bookingController.createBooking);

// List bookings (user)
router.get('/', authUserMiddleware, bookingController.getBookingsUser);


// Provider stats
router.get('/provider/stats', authSproviderMiddleware, bookingController.getProviderStats);

router.get('/recentactivity', authSproviderMiddleware, bookingController.getRecentActivity);
// Get bookings by provider id
router.get('/:id', authCommonMiddleware, bookingController.getBookingsProvider);

// Accept/Reject booking (provider)
router.post('/:id/accept', authSproviderMiddleware, bookingController.acceptBooking);
router.post('/:id/reject', authSproviderMiddleware, bookingController.rejectBooking);

// Mark booking completed (provider)
router.post('/:id/complete', authSproviderMiddleware, bookingController.completeBooking);

// Delete a booking
router.delete('/:id', authCommonMiddleware, bookingController.deleteBooking);


module.exports = router;
