const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility function to create a JWT token for a given user
const createToken = (user) => {
    return jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Token is valid for 2 hours
    );
  };

// Register a new user (default role: 'customer')
exports.register = async (req, res) => {
    const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password, role: 'customer' }); 
    await user.save();

    const token = createToken(user); // Generate JWT token
    res.status(201).json({ token, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login an existing user and return JWT token
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  
      const match = await user.comparePassword(password); // Compare provided password with hashed one
      if (!match) return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = createToken(user); // Generate new token for session
      res.status(200).json({ token, email: user.email, role: user.role});
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  };
