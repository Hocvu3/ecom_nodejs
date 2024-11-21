const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewModel = require('../models/reviewModel');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user', 'guide', 'lead-guide'), reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user', 'guide', 'lead-guide'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'guide', 'lead-guide'), reviewController.deleteReview);

module.exports = router;