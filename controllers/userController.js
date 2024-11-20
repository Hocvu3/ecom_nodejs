const express = require('express');
const User = require('../models/userModel');
exports.getAllUsers = async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        status: 'success',
        results: user.length,
        data: {
            user
        }
    })
};
//Find one user base on id
exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
};
//Create user
exports.createUser = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    })
};
//Update user
exports.updateUser = async (req, res) =>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
};
//Delete user
exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    })
};