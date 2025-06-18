// Import Express and initialize a new router instance
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/*
// Define POST route for user registration and POST route for user login
*/ 
router.post('/register', authController.register);
router.post('/login', authController.login);

// Export the router to be used in the main application
module.exports = router;
