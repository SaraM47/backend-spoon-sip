// Import JWT library for verifying authentication tokens
const jwt = require('jsonwebtoken');

// Middleware to verify JWT tokens for protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify token using secret key and attach decoded user data to the request object
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

// Export the token verification middleware
module.exports = verifyToken;
