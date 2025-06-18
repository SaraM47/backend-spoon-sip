const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/verifyToken');

// Create a new review – only accessible to logged-in users
router.post('/', verifyToken, reviewController.createReview);

// Get all reviews for a specific menu item
router.get('/:menuItemId', reviewController.getReviewsByMenuItem);

// Check if the user has already reviewed a specific product
router.get('/check/:productId', verifyToken, reviewController.checkReview);

// Update an existing review – user must be logged in
router.put('/review/:id', verifyToken, reviewController.updateReview);

// Delete a review – user must be logged in
router.delete('/review/:id', verifyToken, reviewController.deleteReview);

module.exports = router;
