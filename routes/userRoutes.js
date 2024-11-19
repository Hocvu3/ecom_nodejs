const express = require('express');
const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const router = express.Router();

router.route('/')
    .get(userController.getAllUsers);

module.exports = router;