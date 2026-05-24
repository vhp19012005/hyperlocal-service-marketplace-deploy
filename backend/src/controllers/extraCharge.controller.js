const ExtraCharge = require('../models/extraCharge.model');
const Booking = require('../models/book.models');

exports.createExtraCharge = async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;
    const providerId = req.serviceprovider?._id || null;
    const userId = req.user?._id || null;

    if (!bookingId || amount === undefined) {
      return res.status(400).json({ message: 'bookingId and amount are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const extra = new ExtraCharge({
      bookingId,
      provider: providerId,
      user: userId || booking.user,
      amount,
      reason,
      accepted: false,
    });

    await extra.save();
    res.status(201).json(extra);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getExtraChargesForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const charges = await ExtraCharge.find({ bookingId });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserExtraCharges = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const charges = await ExtraCharge.find({ user: userId }).populate('bookingId');
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptExtraCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const charge = await ExtraCharge.findById(id);
    if (!charge) return res.status(404).json({ message: 'Charge not found' });
    charge.accepted = true;
    charge.resolvedAt = new Date();
    await charge.save();
    res.json(charge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectExtraCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const charge = await ExtraCharge.findById(id);
    if (!charge) return res.status(404).json({ message: 'Charge not found' });
    await charge.remove();
    res.json({ message: 'Charge rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
