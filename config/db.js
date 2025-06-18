// Import the Mongoose library for interacting with MongoDB
const mongoose = require('mongoose');

// Define an async function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
