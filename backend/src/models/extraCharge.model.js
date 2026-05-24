const mongoose = require('mongoose');

const extraChargeSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true,
    index: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'serviceProvider',
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  reason: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  }
});

const ExtraCharge = mongoose.model('extraCharge', extraChargeSchema);

module.exports = ExtraCharge;
