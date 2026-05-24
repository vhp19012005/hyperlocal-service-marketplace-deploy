const User = require('../models/user.model');
const ServiceProvider = require('../models/sprovider.model');
const Booking = require('../models/book.models');
const Rating = require('../models/review.model');
const sendEmail = require('../config/sendEmail');
function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

async function sumRevenue(match = {}) {
  const pipeline = [
    { $match: Object.assign({ status: 'completed' }, match) },
    {
      $lookup: {
        from: 'serviceproviders',
        localField: 'provider',
        foreignField: '_id',
        as: 'provider'
      }
    },
    { $unwind: { path: '$provider', preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, total: { $sum: { $ifNull: ['$provider.visitingCost', 0] } } } }
  ];

  const res = await Booking.aggregate(pipeline);
  return (res[0] && res[0].total) || 0;
}

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await ServiceProvider.countDocuments();
    const totalProviderRatings = await ServiceProvider.aggregate([
      { $match: { averageRating: { $ne: 0 } } },
      { $group: { _id: null, total: { $sum: "$averageRating" } } }
    ]);
    const totalProvidersWithRating = await ServiceProvider.aggregate([
  { $match: { averageRating: { $ne: 0 } } },
  { $count: "total" }
]);

 
    const totalBookings = await Booking.countDocuments();
    const totalRatings = totalProviderRatings[0].total / totalProvidersWithRating[0].total;
    const totalRevenue = await sumRevenue();
    // Completion rate: percentage of bookings with status 'completed'
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const completionRate = totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0;

    // Use 30 day windows for growth comparisons
    const now = new Date();
    const days = 30;
    const lastStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const prevStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
    const prevEnd = lastStart;

    const usersLast = await User.countDocuments({ createdAt: { $gte: lastStart } });
    const usersPrev = await User.countDocuments({ createdAt: { $gte: prevStart, $lt: prevEnd } });

    const providersLast = await ServiceProvider.countDocuments({ createdAt: { $gte: lastStart } });
    const providersPrev = await ServiceProvider.countDocuments({ createdAt: { $gte: prevStart, $lt: prevEnd } });

    const bookingsLast = await Booking.countDocuments({ createdAt: { $gte: lastStart } });
    const bookingsPrev = await Booking.countDocuments({ createdAt: { $gte: prevStart, $lt: prevEnd } });

    const revenueLast = await sumRevenue({ createdAt: { $gte: lastStart } });
    const revenuePrev = await sumRevenue({ createdAt: { $gte: prevStart, $lt: prevEnd } });

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      completedBookings,
      completionRate,
      userGrowth: percentChange(usersLast, usersPrev),
      providerGrowth: percentChange(providersLast, providersPrev),
      bookingGrowth: percentChange(bookingsLast, bookingsPrev),
      revenueGrowth: percentChange(revenueLast, revenuePrev),
      totalRatings,
      // include additional fields used by frontend if desired
      statsWindow: {
        lastWindowStart: lastStart,
        lastWindowEnd: now
      }
    });
  } catch (err) {
    console.error('Error getting admin stats', err);
    res.status(500).json({ message: 'Failed to compute admin stats', error: err.message });
  }
};

exports.getRecentBookings = async (req, res) => {
  try {
    let limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : NaN;
    if (isNaN(limit)) limit = 10; // default
    // interpret 0 or negative as no limit (return all)
    const query = Booking.find({}).sort({ createdAt: -1 });
    if (limit > 0) query.limit(limit);

    const bookings = await query
      .populate('user', 'firstName lastName email')
      .populate('provider', 'serviceName firstName lastName visitingCost');

    const recent = bookings.map(b => ({
      id: b._id,
      user: b.user ? `${b.user.firstName} ${b.user.lastName}` : null,
      userEmail: b.user ? b.user.email : null,
      provider: b.provider ? (b.provider.serviceName || `${b.provider.firstName} ${b.provider.lastName}`) : null,
      providerName: b.provider ? `${b.provider.firstName} ${b.provider.lastName}` : null,
      service: b.provider ? b.provider.serviceName : null,
      providerCategory: b.provider ? b.provider.serviceCategory : null,
      city: b.provider ? b.provider.city : null,
      status: b.status,
      date: b.serviceDate,
      time: b.serviceTime,
      amount: b.provider ? b.provider.visitingCost : null,
      address: b.address || null,
      issue: b.issue || null,
      createdAt: b.createdAt
    }));

    res.status(200).json({ recentBookings: recent });
  } catch (err) {
    console.error('Error getting recent bookings', err);
    res.status(500).json({ message: 'Failed to fetch recent bookings', error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking', err);
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const q = req.query.q
      ? {
          $or: [
            { firstName: new RegExp(req.query.q, "i") },
            { lastName: new RegExp(req.query.q, "i") },
            { email: new RegExp(req.query.q, "i") },
            { phone: new RegExp(req.query.q, "i") }
          ]
        }
      : {};

    const users = await User.aggregate([
      { $match: q },

      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "user",
          as: "bookings"
        }
      },

      {
        $addFields: {
          totalBookings: { $size: "$bookings" }
        }
      },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          address: 1,
          city: 1,
          pincode: 1,
          createdAt: 1,
          profileImage: 1,
          totalBookings: 1
        }
      },

      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await User.countDocuments(q);

    res.status(200).json({
      users,
      total,
      page,
      limit
    });

  } catch (err) {
    console.error("Error listing users", err);
    res.status(500).json({
      message: "Failed to list users",
      error: err.message
    });
  }
};

// Admin: get single user by id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Admin: update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['firstName','lastName','email','phone','address','city','pincode','profileImage'];
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// Admin: delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Admin: list providers (with pagination & optional search)

exports.getAllProviders = async (req, res) => {
  try {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const q = req.query.q
      ? {
          $or: [
            { serviceName: new RegExp(req.query.q, "i") },
            { firstName: new RegExp(req.query.q, "i") },
            { lastName: new RegExp(req.query.q, "i") },
            { email: new RegExp(req.query.q, "i") }
          ]
        }
      : {};

    const providers = await ServiceProvider.aggregate([
      { $match: q },

      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "provider",
          as: "bookings"
        }
      },

      {
        $addFields: {
          totalJobs: { $size: "$bookings" }
        }
      },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          serviceName: 1,
          email: 1,
          phone: 1,
          serviceCategory: 1,
          city: 1,
          visitingCost: 1,
          averageRating: 1,
          totalReviews: 1,
          isAvailable: 1,
          profileImage: 1,
          createdAt: 1,
          totalJobs: 1
        }
      },

      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await ServiceProvider.countDocuments(q);

    res.status(200).json({
      providers,
      total,
      page,
      limit
    });

  } catch (err) {
    console.error("Error listing providers", err);
    res.status(500).json({
      message: "Failed to list providers",
      error: err.message
    });
  }
};
// Admin: get single provider by id
exports.getProviderById = async (req, res) => {
  try {
    
    const { id } = req.params;
    const provider = await ServiceProvider.findById(id).lean();
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json({ provider });
  } catch (err) {
    console.error('Error fetching provider', err);
    res.status(500).json({ message: 'Failed to fetch provider', error: err.message });
  }
};

// Admin: update provider
exports.updateProvider = async (req, res) => {
  try {
    
    const { id } = req.params;
    const allowed = ['firstName','lastName','serviceName','email','phone','serviceCategory','address','city','pincode','visitingCost','isAvailable','profileImage'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const provider = await ServiceProvider.findByIdAndUpdate(id, updates, { new: true });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json({ provider });
  } catch (err) {
    console.error('Error updating provider', err);
    res.status(500).json({ message: 'Failed to update provider', error: err.message });
  }
};

// Admin: delete provider
exports.deleteProvider = async (req, res) => {
  try {
    
    const { id } = req.params;
    const provider = await ServiceProvider.findByIdAndDelete(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.status(200).json({ message: 'Provider deleted' });
  } catch (err) {
    console.error('Error deleting provider', err);
    res.status(500).json({ message: 'Failed to delete provider', error: err.message });
  }
};

// Admin: summary of providers with aggregated ratings and recent reviews
exports.getReviewSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
     const totalProviderRatings = await ServiceProvider.aggregate([
      { $match: { averageRating: { $ne: 0 } } },
      { $group: { _id: null, total: { $sum: "$averageRating" } } }
    ]);
    const totalProvidersWithRating = await ServiceProvider.aggregate([
  { $match: { averageRating: { $ne: 0 } } },
  { $count: "total" }
]);
    const totalRatings = totalProviderRatings[0].total / totalProvidersWithRating[0].total;

    const q = req.query.q
      ? {
          $or: [
            { serviceName: new RegExp(req.query.q, 'i') },
            { firstName: new RegExp(req.query.q, 'i') },
            { lastName: new RegExp(req.query.q, 'i') },
            { email: new RegExp(req.query.q, 'i') }
          ]
        }
      : {};

    // Aggregate providers with reviews and completed jobs count
    const providersAgg = await ServiceProvider.aggregate([
      { $match: q },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'provider',
          as: 'reviews'
        }
      },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'provider',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          averageRating: { $cond: [{ $gt: [{ $size: '$reviews' }, 0] }, { $avg: '$reviews.rating' }, null] },
          totalReviews: { $size: '$reviews' },
          completedJobs: { $size: '$bookings' }
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          serviceName: 1,
          email: 1,
          phone: 1,
          serviceCategory: 1,
          city: 1,
          isAvailable: 1,
          averageRating: 1,
          totalReviews: 1,
          profileImage: 1,
          createdAt: 1,
          completedJobs: 1
        }
      },
      { $sort: { totalReviews: -1, averageRating: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Enrich with recent reviews (populated user name)
    const providers = await Promise.all(providersAgg.map(async (p) => {
      const recent = await Rating.find({ provider: p._id }).sort({ createdAt: -1 }).limit(3).populate('user', 'firstName lastName').lean();
      const recentReviews = recent.map(r => ({ id: r._id, user: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : null, rating: r.rating, comment: r.comment, date: r.createdAt }));

      return {
        id: p._id,
        firstName: p.firstName,
        lastName: p.lastName,
        serviceName: p.serviceName,
        email: p.email,
        phone: p.phone,
        serviceCategory: p.serviceCategory,
        city: p.city,
        isAvailable: p.isAvailable,
        averageRating: p.averageRating || 0,
        totalReviews: p.totalReviews || 0,
        completedJobs: p.completedJobs || 0,
        profileImage: p.profileImage,
        createdAt: p.createdAt,
        recentReviews,
        totalRatings
      };
    }));

    const total = await ServiceProvider.countDocuments(q);

    res.status(200).json({ providers, total, page, limit });
  } catch (err) {
    console.error('Error getting review summary', err);
    res.status(500).json({ message: 'Failed to fetch review summary', error: err.message });
  }
};

// Admin: get reviews for a single provider (paginated)
exports.getProviderReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Rating.find({ provider: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .lean();

    const total = await Rating.countDocuments({ provider: id });

    const mapped = reviews.map(r => ({ id: r._id, user: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : null, email: r.user ? r.user.email : null, rating: r.rating, comment: r.comment, date: r.createdAt }));

    res.status(200).json({ reviews: mapped, total, page, limit });
  } catch (err) {
    console.error('Error fetching provider reviews', err);
    res.status(500).json({ message: 'Failed to fetch provider reviews', error: err.message });
  }
};

// Admin: delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Rating.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review', err);
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

// Admin: set provider availability (toggle or explicit)
exports.setProviderAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    // fetch provider
    const provider = await ServiceProvider.findById(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    // if client provided explicit value, use it, otherwise toggle
    if (typeof isAvailable === 'boolean') {
      provider.isAvailable = isAvailable;
    } else {
      provider.isAvailable = !provider.isAvailable;
    }

    await provider.save();

    res.status(200).json({ provider });
  } catch (err) {
    console.error('Error setting provider availability', err);
    res.status(500).json({ message: 'Failed to set provider availability', error: err.message });
  }
};

// Admin: completion rate summary per provider
exports.getCompletionSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const q = req.query.q
      ? {
          $or: [
            { serviceName: new RegExp(req.query.q, 'i') },
            { firstName: new RegExp(req.query.q, 'i') },
            { lastName: new RegExp(req.query.q, 'i') },
            { email: new RegExp(req.query.q, 'i') }
          ]
        }
      : {};

    const providersAgg = await ServiceProvider.aggregate([
      { $match: q },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'provider',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          totalJobs: { $size: '$bookings' },
          completedJobs: { $size: { $filter: { input: '$bookings', as: 'b', cond: { $eq: ['$$b.status', 'completed'] } } } },
          rejectedJobs: { $size: { $filter: { input: '$bookings', as: 'b', cond: { $eq: ['$$b.status', 'rejected'] } } } },
          cancelledJobs: { $size: { $filter: { input: '$bookings', as: 'b', cond: { $in: ['$$b.status', ['cancelled', 'canceled']] } } } }
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          serviceName: 1,
          email: 1,
          phone: 1,
          serviceCategory: 1,
          city: 1,
          isAvailable: 1,
          profileImage: 1,
          createdAt: 1,
          totalJobs: 1,
          completedJobs: 1,
          cancelledJobs: 1,
          rejectedJobs: 1
        }
      },
      { $sort: { totalJobs: -1, completedJobs: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const providers = providersAgg.map(p => {
      const total = p.totalJobs || 0;
      const completed = p.completedJobs || 0;
      const rate = total ? Number(((completed / total) * 100).toFixed(1)) : 0;
      return {
        id: p._id,
        name:  `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        email: p.email,
        category: p.serviceCategory,
        city: p.city,
        status: (typeof p.isAvailable === 'boolean') ? (p.isAvailable ? 'active' : 'inactive') : 'active',
        totalJobs: total,
        completedJobs: completed,
        cancelledJobs: p.cancelledJobs || 0,
        rejectedJobs: p.rejectedJobs || 0,
        completionRate: rate
      };
    });

    const total = await ServiceProvider.countDocuments(q);

    res.status(200).json({ providers, total, page, limit });
  } catch (err) {
    console.error('Error getting completion summary', err);
    res.status(500).json({ message: 'Failed to fetch completion summary', error: err.message });
  }
};

// Admin: send email to provider (from admin dashboard)
exports.mailProvider = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) return res.status(400).json({ message: 'email, subject and message are required' });

    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });

    // send email using helper
    await sendEmail(email, subject, message);
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email to provider', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};

// Admin: send email to user (from admin dashboard)
exports.mailUser = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) return res.status(400).json({ message: 'email, subject and message are required' });

    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });

    // Optionally verify user exists (non-blocking)
    const user = await User.findOne({ email }).select('email').lean();
    if (!user) {
      // still allow sending, but warn in logs
      console.warn(`Admin is attempting to email non-existing user: ${email}`);
    }

    // send email using helper
    await sendEmail(email, subject, message);
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email to user', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};