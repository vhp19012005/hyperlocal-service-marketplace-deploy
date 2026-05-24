const Booking = require('../models/book.models');
const UserModel = require('../models/user.model');
const ServiceProvider = require('../models/sprovider.model');
// Create a new booking (user must be authenticated)
exports.createBooking = async (req, res) => {
  try {
    const { provider, issue, serviceDate, serviceTime, address } = req.body;

    if (!provider || !issue || !serviceDate || !serviceTime || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider,
      issue,
      serviceDate,
      serviceTime,
      address,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings (optional filters via query: user, provider, status)
exports.getBookingsUser = async (req, res) => {
  try {
   const user = req.user._id;
  const usrExists = await UserModel.findById(user);
  if(!usrExists) {
    return res.status(400).json({message: "User not found"});
  }
    const bookings = await Booking.find({ user }).populate('provider');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single booking by ID
exports.getBookingsProvider = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.params.id })
      .populate('user', 'firstName lastName email')
      .populate('provider', 'firstName lastName serviceName email');

    if (!bookings) return res.status(404).json({ message: 'No bookings found' });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingsProvider = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.params.id })
      .populate('user', 'firstName lastName email')
      .populate('provider', 'firstName lastName serviceName email');

    if (!bookings) return res.status(404).json({ message: 'No bookings found' });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Compute stats for a service provider
exports.getProviderStats = async (req, res) => {
  try {
    const providerId = req.serviceprovider?._id || req.params.id;
    if (!providerId) {
      return res.status(400).json({ message: 'Provider id missing' });
    }

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    const [pendingCount, acceptedCount, inProgressCount, completedCount] = await Promise.all([
      Booking.countDocuments({ provider: providerId, status: 'pending' }),
      Booking.countDocuments({ provider: providerId, status: 'accepted' }),
      Booking.countDocuments({ provider: providerId, status: 'in-progress' }),
      Booking.countDocuments({ provider: providerId, status: 'completed' }),
    ]);

    const ongoingJobs = acceptedCount + inProgressCount;
    const averageRating = provider.averageRating;

    // Return actual values from database
    res.status(200).json({
      newRequests: pendingCount,
      ongoingJobs,
      completedJobs: completedCount,
      averageRating,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking (status, times, address, reviewGiven, etc.)
// exports.updateBooking = async (req, res) => {
//   try {
//     const { status, completedAt, reviewGiven, issue, serviceDate, serviceTime, address } = req.body;

//     const updates = { status, completedAt, reviewGiven, issue, serviceDate, serviceTime, address };
//     Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true }
//     );

//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     res.json(booking);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// Delete booking

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const providerId = req.serviceprovider?._id || req.params.id;
    if (!providerId) {
      return res.status(400).json({ message: 'Provider id missing' });
    }
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    const booking = await Booking.find({ provider: providerId });
    console.log(booking);
    res.status(200).json({
      activity: booking.map(b => ({
        time: b.serviceTime,
        title: b.issue,
        date: b.serviceDate,
        status: b.status,
        amount: provider.visitingCost
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.acceptBooking = async (req, res) => {
  try {
    const providerId = req.serviceprovider?._id;
    const { id } = req.params;
    if (!providerId) return res.status(401).json({ message: 'Unauthorized' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.provider) !== String(providerId)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be accepted' });
    }
    booking.status = 'accepted';
    await booking.save();
    res.status(200).json({ message: 'Booking accepted', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const providerId = req.serviceprovider?._id;
    const { id } = req.params;
    if (!providerId) return res.status(401).json({ message: 'Unauthorized' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.provider) !== String(providerId)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status === 'completed'||booking.status === 'rejected') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected' });
    }
    booking.status = 'rejected';
    await booking.save();
    res.status(200).json({ message: 'Booking rejected', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    const providerId = req.serviceprovider?._id;
    const { id } = req.params;
    if (!providerId) return res.status(401).json({ message: 'Unauthorized' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.provider) !== String(providerId)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Booking already completed' });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    res.status(200).json({ message: 'Booking marked as completed', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};