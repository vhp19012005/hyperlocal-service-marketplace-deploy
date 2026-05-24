const Review = require('../models/review.model');
const ServiceProvider = require('../models/sprovider.model');
const UserProvider = require('../models/user.model');
const bookingModel = require('../models/book.models');

// Create a new review
exports.createReview = async (req, res) => {
  
    const { providerId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if provider exists
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    // Prevent duplicate review by same user for same provider
    // const existingReview = await Review.findOne({ user: userId, provider: providerId });
    // if (existingReview) {
    //   return res.status(400).json({ message: 'You have already reviewed this provider' });
    // }
    
    const review = new Review({
      user: userId,
      provider: providerId,
      rating,
      comment
    });
    await review.save();

    // Update provider's average rating and review count
    const reviews = await Review.find({ provider: providerId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    provider.averageRating = avgRating;
    provider.totalReviews = reviews.length;
    await provider.save();

    const booking = await bookingModel.findOne({ user: userId, provider: providerId });
    if (booking) {
      booking.reviewGiven = true;
      await booking.save();
    }

    res.status(201).json(review);
 
};


// Get all reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await ServiceProvider.findById(providerId);
    const reviews = await Review.find({ provider: providerId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({
      averageRating: provider ? provider.averageRating : 0,
      totalReviews: provider ? provider.totalReviews : 0,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserProvider.findById(userId);
    if(!user) {
      return res.status(400).json({message: "User not found"});
    }
    const reviews = await Review.find({ user: userId }).populate('provider');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });   
  }   
};  
