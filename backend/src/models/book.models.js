const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },

  issue: {
    type: String,
    required: true, 
  },

  serviceDate: {
    type: String,
    required: true, 
  },

  serviceTime: {
    type: String,
    required: true, 
  },

  address: {
    type: String,
    required: true, 
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "in-progress", "completed", "rejected"],
    default: "pending",
  },

  reviewGiven: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: Date,
});

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;
