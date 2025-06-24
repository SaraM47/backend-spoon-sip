// Import Mongoose to define the schema and model
const mongoose = require('mongoose');

// Define schema for contact messages sent through the contact form
const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // make it optional so guests can also send messages
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export the model to interact with the 'ContactMessage' collection in MongoDB
module.exports = mongoose.model('ContactMessage', contactSchema);