const Order = require('../models/Order');
const Tool = require('../models/Tool');

// Create new order (rent or buy)
exports.createOrder = async (req, res) => {
  try {
    const { tool, type, startDate, endDate, totalPrice } = req.body;
    
    // Validation for rent dates
    if (type === 'rent') {
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required for rent' });
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start < new Date()) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
      }
      
      if (end <= start) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
      
      // Prevent double booking
      const existingOrder = await Order.findOne({
        tool,
        type: 'rent',
        status: { $in: ['pending', 'accepted'] },
        $or: [
          { startDate: { $lte: end, $gte: start } },
          { endDate: { $lte: end, $gte: start } }
        ]
      });
      
      if (existingOrder) {
        return res.status(400).json({ message: 'Tool is already booked for this period' });
      }
    }
    
    const toolData = await Tool.findById(tool);
    if (!toolData) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    const order = await Order.create({
      tool,
      renter: req.user.id,
      owner: toolData.owner,
      type,
      startDate: type === 'rent' ? startDate : null,
      endDate: type === 'rent' ? endDate : null,
      totalPrice
    });
    
    // Get order with tool details (includes _id)
    const newOrder = await Order.findById(order._id)
      .populate('tool', 'title images priceRentPerDay');
    
    res.status(201).json(newOrder);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my orders (as a student/renter)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ renter: req.user.id })
      .populate('tool', 'title images priceRentPerDay priceSell')
      .populate('owner', 'name email phone')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders for my tools (as a graduate/owner)
exports.getMyListingsOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.user.id })
      .populate('tool', 'title images')
      .populate('renter', 'name email phone')
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (graduate only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    order.status = status;
    await order.save();
    
    // Update tool status if order is accepted
    if (status === 'accepted') {
      const tool = await Tool.findById(order.tool);
      if (order.type === 'rent') tool.status = 'rented';
      if (order.type === 'buy') tool.status = 'sold';
      await tool.save();
    }
    
    // If order is completed, tool becomes available again (for rent)
    if (status === 'completed') {
      const tool = await Tool.findById(order.tool);
      if (order.type === 'rent' && tool.status === 'rented') {
        tool.status = 'available';
        await tool.save();
      }
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};