const mongoose = require('mongoose');

// Define schema for menu items 
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: [{ type: String }],
  category: { type: String, required: true },
  image: { type: String } 
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
