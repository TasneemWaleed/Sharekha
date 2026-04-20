const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['rent', 'buy'], required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);