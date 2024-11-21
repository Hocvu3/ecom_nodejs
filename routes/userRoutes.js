const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.route('/')
    .get(userController.getAllUsers)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide', 'user'), userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide', 'user'), userController.updateUser)    
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), userController.deleteUser);

module.exports = router;