const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(tourController.getAllTours)
    .post(authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;

///test tinh nang template again