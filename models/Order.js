const mongoose = require('mongoose');

// Define schema for customer orders
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  time: { type: Date, required: true },
  menuItemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  status: { // Order status (default is pending)
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);
