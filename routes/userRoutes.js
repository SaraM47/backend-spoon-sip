const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');


// GET /api/users
// This route returns a list of all registered users (admin only).
// verifyToken: ensures that the request comes from a logged in user
// isAdmin: ensures that the user has the role "admin"
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ account_created: -1 }); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// GET /api/delete
// Only admins can delete
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
  });

module.exports = router;
