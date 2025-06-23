const mongoose = require('mongoose');

// Define schema for customer orders
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  time: { type: Date, required: true },
  people: { type: Number },
  note: { type: String }, 

  // Individuel choice
  acai: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: false },
  smoothie: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: false },
  juice: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: false },

  // Automatically generated menu field for receipt/stats
  menuItemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  status: { // Order status (default is pending)
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);
