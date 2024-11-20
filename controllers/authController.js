const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const crypto = require('crypto');
// const { promisify } = require('util');
//Create sign token
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
//Create send token
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
//Sign Up
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(newUser, 201, res);
});
//Login
exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
});
//Logout
exports.logout = (req, res) => {
    res.cookie('jwt', 'log out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({status: 'success'});
};

