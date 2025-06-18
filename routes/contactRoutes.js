const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Everyone can send a contact message
router.post('/', contactController.createMessage);

// Only admins can view and delete messages
router.get('/', verifyToken, isAdmin, contactController.getAllMessages);
router.delete('/:id', verifyToken, isAdmin, contactController.deleteMessage);

module.exports = router;
