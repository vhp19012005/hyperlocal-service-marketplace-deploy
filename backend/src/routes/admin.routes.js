const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authUserMiddleware} = require('../middlewares/auth.middleware');

// Dashboard stats - restricted to admin role via middleware check
router.get('/dashboard', authUserMiddleware, adminController.getDashboardStats);

// Recent bookings
router.get('/recent-bookings', authUserMiddleware, adminController.getRecentBookings);

router.delete('/delete-booking/:id', authUserMiddleware, adminController.deleteBooking);

// List users with pagination & search
router.get('/users', authUserMiddleware, adminController.getAllUsers);
router.put('/users/:id', authUserMiddleware, adminController.updateUser);
router.delete('/delete-user/:id', authUserMiddleware, adminController.deleteUser);
// Providers management (list, get, update, delete)
router.get('/providers', authUserMiddleware, adminController.getAllProviders);
router.get('/providers/:id', authUserMiddleware, adminController.getProviderById);
router.put('/update-providers/:id', authUserMiddleware, adminController.updateProvider);
router.delete('/delete-providers/:id', authUserMiddleware, adminController.deleteProvider);

// Endpoint to send email to provider (from admin dashboard)
router.post('/provider/mail', authUserMiddleware, adminController.mailProvider);
// Endpoint to send email to a user (from admin dashboard)
router.post('/user/mail', authUserMiddleware, adminController.mailUser);

// Reviews: summary, provider reviews, delete review
router.get('/reviews/summary', authUserMiddleware, adminController.getReviewSummary);
router.get('/providers/:id/reviews', authUserMiddleware, adminController.getProviderReviews);
router.delete('/reviews/:id', authUserMiddleware, adminController.deleteReview);

// Completion summary (completion rate per provider)
router.get('/completion/summary', authUserMiddleware, adminController.getCompletionSummary);

router.put('/provider/availability/:id', authUserMiddleware, adminController.setProviderAvailability);
module.exports = router;
