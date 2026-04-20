const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  faculty: { type: String },
  priceSell: { type: Number },
  priceRentPerDay: { type: Number },
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'sold'], 
    default: 'available' 
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tool', ToolSchema);