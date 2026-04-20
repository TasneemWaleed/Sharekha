const Tool = require('../models/Tool');

// Get all tools with filters
exports.getTools = async (req, res) => {
  try {
    const { category, search, type, faculty } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (faculty) filter.faculty = faculty;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (type === 'rent') filter.priceRentPerDay = { $exists: true, $ne: null };
    if (type === 'sell') filter.priceSell = { $exists: true, $ne: null };
    
    const tools = await Tool.find(filter)
      .populate('owner', 'name email phone location role')
      .sort('-createdAt');
    
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tools for current user (graduate)
exports.getMyTools = async (req, res) => {
  try {
    const tools = await Tool.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single tool
exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('owner', 'name email phone location role');
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new tool (graduate only)
exports.createTool = async (req, res) => {
  try {
    const tool = await Tool.create({ 
      ...req.body, 
      owner: req.user.id 
    });
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update tool
exports.updateTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    if (tool.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updated = await Tool.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete tool
exports.deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    if (tool.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await tool.deleteOne();
    res.json({ message: 'Tool removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};