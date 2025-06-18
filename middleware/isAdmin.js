// Middleware to restrict access to admin users only
module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    next(); // Continue if the user is an admin
  };
  