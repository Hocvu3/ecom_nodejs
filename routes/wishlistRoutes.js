const express = require('express');
const mongoose = require('mongoose');
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
router.use(authController.protect);

router.route('/')
    .get(wishlistController.getAllWishlists)
    .post(authController.restrictTo('user', 'guide', 'lead-guide'),reviewController.setTourUserIds, wishlistController.createWishlist);

router.route('/:id')
    .get(wishlistController.getWishlist)
    .patch(authController.restrictTo('user', 'guide', 'lead-guide'), wishlistController.updateWishlist)
    .delete(authController.restrictTo('user', 'guide', 'lead-guide'), wishlistController.deleteWishlist);

module.exports = router;