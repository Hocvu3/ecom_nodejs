const express = require('express');
const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(userController.getAllUsers)
    .post(userModel.create);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)    
    .delete(userController.deleteUser);

module.exports = router;