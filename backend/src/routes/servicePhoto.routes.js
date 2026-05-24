const express = require('express');
const router = express.Router();
const { authSproviderMiddleware, authCommonMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadServicePhoto } = require('../controllers/upload.controller');
const ServicePhoto = require('../models/servicePhoto.model');

router.post(
  '/upload-service-photo',
  authSproviderMiddleware,
  upload.single('photo'),
  uploadServicePhoto
);

// GET photos for a booking
router.get('/booking/:bookingId', authCommonMiddleware, async (req, res) => {
  try {
    const photos = await ServicePhoto.find({ bookingId: req.params.bookingId });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET photos for a provider (aggregate by bookings of provider)
router.get('/provider/:providerId', authCommonMiddleware, async (req, res) => {
  try {
    // find bookings for provider and then photos
    const Booking = require('../models/book.models');
    const bookings = await Booking.find({ provider: req.params.providerId }).select('_id');
    const bookingIds = bookings.map(b => b._id);
    const photos = await ServicePhoto.find({ bookingId: { $in: bookingIds } });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
