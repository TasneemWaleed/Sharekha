const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getTools, 
  getMyTools,
  getToolById, 
  createTool, 
  updateTool, 
  deleteTool 
} = require('../controllers/toolsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/', getTools);
router.get('/my-tools', auth, getMyTools);
router.get('/:id', getToolById);

router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('priceSell').optional().isNumeric(),
  body('priceRentPerDay').optional().isNumeric()
], validate, createTool);

router.put('/:id', auth, updateTool);
router.delete('/:id', auth, deleteTool);

module.exports = router;