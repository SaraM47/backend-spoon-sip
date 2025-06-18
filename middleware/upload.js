// Import required libraries and configured Cloudinary instance
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary as the storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'menu_images', // Store images in this Cloudinary folder
    allowed_formats: ['jpg', 'png'] // Only allow JPG and PNG files
  }
});

// Initialize Multer with the configured storage engine
const upload = multer({ storage });

module.exports = upload;
