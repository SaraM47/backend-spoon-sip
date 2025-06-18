const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload'); // Multer and Cloudinary configuration

// Public routes
router.get('/', menuController.getMenuItems); // Fetch all menu items
router.get('/:id', menuController.getMenuItemById); // Fetch a specific menu item by ID

// Protected routes – only admins can add or modify items
router.post('/', verifyToken,isAdmin, upload.single('image'), menuController.createMenuItem); // Handles image upload during creation

router.put('/:id', verifyToken, isAdmin, upload.single('image'), menuController.updateMenuItem); // Handles image upload during update
  
router.put('/:id', verifyToken, isAdmin, menuController.updateMenuItem); // Handles update without image
router.delete('/:id', verifyToken, isAdmin, menuController.deleteMenuItem); // Only admins can delete menu items

module.exports = router;
