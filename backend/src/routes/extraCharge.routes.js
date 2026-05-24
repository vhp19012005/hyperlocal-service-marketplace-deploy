const express = require('express');
const router = express.Router();
const extraChargeController = require('../controllers/extraCharge.controller');
const { authSproviderMiddleware, authUserMiddleware, authCommonMiddleware } = require('../middlewares/auth.middleware');

// Provider creates an extra charge for a booking
router.post('/', authSproviderMiddleware, extraChargeController.createExtraCharge);

// Get extra charges for a booking (any authenticated)
router.get('/booking/:bookingId', authCommonMiddleware, extraChargeController.getExtraChargesForBooking);

// Get extra charges for current user
router.get('/me', authUserMiddleware, extraChargeController.getUserExtraCharges);

module.exports = router;
