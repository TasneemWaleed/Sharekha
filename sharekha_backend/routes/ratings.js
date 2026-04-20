const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { addRating, getToolRatings, getUserRatings } = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('type').isIn(['tool', 'user']).withMessage('Type must be tool or user'),
  body('comment').optional().isLength({ max: 500 })
], validate, addRating);

router.get('/tool/:toolId', getToolRatings);
router.get('/user/:userId', getUserRatings);

module.exports = router;