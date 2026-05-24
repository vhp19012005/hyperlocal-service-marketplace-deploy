const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const {authUserMiddleware} = require('../middlewares/auth.middleware');

// Create a review (user must be authenticated)
router.post('/', authUserMiddleware, reviewController.createReview);

// Get all reviews for a provider
router.get('/provider/:providerId', reviewController.getProviderReviews);

// Get average rating for a provider
// router.get('/provider/:providerId/average', reviewController.getProviderRating);

// Get all reviews for a user
router.get('/user/me', authUserMiddleware, reviewController.getUserReviews);

module.exports = router;
