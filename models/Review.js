const mongoose = require('mongoose');

// Define schema for reviews submitted by users
const reviewSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: false, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } // Timestamp of review creation
});

module.exports = mongoose.model('Review', reviewSchema);