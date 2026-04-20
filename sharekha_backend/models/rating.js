const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['tool', 'user'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate ratings for same order
RatingSchema.index({ order: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);