const Review = require('../models/Review');

// Create a new review from a logged-in user
exports.createReview = async (req, res) => {
  try {
    const { menuItemId, name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const review = new Review({
      menuItemId: menuItemId || null, // accept null if tehre no sending 
      name,
      rating,
      comment,
      userId: req.user?.userId || null, // if only token exists
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create review', error: err.message });
  }
};


// Fetch all reviews for a specific menu item
exports.getReviewsByMenuItem = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItemId: req.params.menuItemId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch reviews', error: err.message });
  }
};

// Fetch latest reviews for homepage
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Check if the current user has already submitted a review
exports.checkReview = async (req, res) => {
  try {
    const existing = await Review.findOne({
      menuItemId: req.params.productId,
      userId: req.user.userId
    });
    res.status(200).json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check review', error: err.message });
  }
};

// Update an existing review (user)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Remove a review (only admin allowed)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (!req.user) {
      return res.status(401).json({ message: 'No user info from token' });
    }

    const isOwner = review.userId && review.userId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
