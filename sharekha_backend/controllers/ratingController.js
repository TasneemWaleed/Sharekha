const Rating = require('../models/Rating');
const Tool = require('../models/Tool');
const Order = require('../models/Order');

// Add rating for tool or user
exports.addRating = async (req, res) => {
  try {
    const { tool, to, rating, comment, type, orderId } = req.body;
    
    // Verify user has permission to rate (completed order)
    const order = await Order.findOne({
      _id: orderId,
      renter: req.user.id,
      status: 'completed'
    });
    
    if (!order && type === 'tool') {
      return res.status(403).json({ message: 'You can only rate tools from completed orders' });
    }
    
    const newRating = await Rating.create({
      from: req.user.id,
      to,
      tool,
      type,
      rating,
      comment,
      order: orderId
    });
    
    // Update tool average rating
    if (type === 'tool' && tool) {
      const toolRatings = await Rating.find({ tool, type: 'tool' });
      const avg = toolRatings.reduce((sum, r) => sum + r.rating, 0) / toolRatings.length;
      await Tool.findByIdAndUpdate(tool, { 
        $push: { ratings: newRating._id },
        averageRating: avg 
      });
    }
    
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ratings for a tool
exports.getToolRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ 
      tool: req.params.toolId, 
      type: 'tool' 
    }).populate('from', 'name');
    
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ratings for a user
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ 
      to: req.params.userId, 
      type: 'user' 
    }).populate('from', 'name');
    
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;
    
    res.json({ ratings, averageRating: avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};