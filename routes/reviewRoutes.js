const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewModel = require('../models/reviewModel');
const reviewController = require('../controllers/reviewController');
router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;