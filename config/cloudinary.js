/* Import the Cloudinary library (version 2) for image upload and management */
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials stored in environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Export the configured Cloudinary instance for use throughout the app
module.exports = cloudinary;
