const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const { promisify } = require('util');
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

//Protect force authentication blocking
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    //1) Getting token and check if it's there
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if(req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if(!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }
        //2) Verification
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        //3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }
        //4) Check if user changed password after the token was issued
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again', 401));
        }
        //Grant access to protected route
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
});
//Is logged in for server side rendering non-blocking
exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) {
                return next();
            }
            if(currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

//Restrict to admin
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};