const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();


router.route('/')
    .get(tourController.getAllTours);
// router.get('/:id', tourController.getTour);
// router.post('/', tourController.createTour);
// router.patch('/:id', tourController.updateTour);
// router.delete('/:id', tourController.deleteTour);

module.exports = router;