// Import core modules and environment variables
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import custom modules: database connection and route handlers
const connectDB = require('./config/db'); 
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express application and apply middleware
const app = express();
app.use(cors());
app.use(express.json());

// Define API route endpoints and their corresponding route handlers
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// Connect to the MongoDB database
connectDB();

// Start the server on specified port and log the status
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
