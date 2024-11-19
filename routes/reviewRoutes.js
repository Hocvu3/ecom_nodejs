const express = require('express');
const router = express.Router();
const reviewModel = require('../models/reviewModel');
const reviewController = require('../controllers/reviewController');
router.route('/')
    .get(reviewController.getAllReviews);

module.exports = router;