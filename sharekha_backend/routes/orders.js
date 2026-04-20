const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  createOrder, 
  getMyOrders, 
  getMyListingsOrders, 
  updateOrderStatus 
} = require('../controllers/ordersController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [
  auth,
  body('tool').notEmpty().withMessage('Tool ID is required'),
  body('type').isIn(['rent', 'buy']).withMessage('Type must be rent or buy'),
  body('totalPrice').isNumeric().withMessage('Total price is required')
], validate, createOrder);

router.get('/my-orders', auth, getMyOrders);
router.get('/my-listings', auth, getMyListingsOrders);
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;