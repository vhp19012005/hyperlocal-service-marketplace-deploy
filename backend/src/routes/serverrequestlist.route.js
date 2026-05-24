const express = require('express');
const router = express.Router();
const serviceRequestListController = require('../controllers/servicerequestlist.controller');
const { authSproviderMiddleware } = require('../middlewares/auth.middleware');

// GET service requests for provider dashboard
router.get('/', authSproviderMiddleware, serviceRequestListController.getProviderBookings);
router.get('/job/:id', authSproviderMiddleware, serviceRequestListController.getJobDetails);
router.post('/otp/:id', authSproviderMiddleware, serviceRequestListController.sendOtp);
router.post('/verifyotp', authSproviderMiddleware, serviceRequestListController.verifyOtp);
module.exports = router;