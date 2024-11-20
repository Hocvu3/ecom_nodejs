const express = require('express');
const Review = require('../models/reviewModel');

exports.setTourUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};


exports.getAllReviews = async (req, res) => {
    await Review.find()
        .then(reviews => res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews
            }
        }))
        .catch(err => res.status(404).json({
            status: 'fail',
            message: err
        }));
};
//Find one review base on id
exports.getReview = async (req, res) => {
    await Review.findById(req.params.id)
        .then(review => res.status(200).json({
            status: 'success',
            data: {
                review
            }
        }))
        .catch(err => res.status(404).json({
            status: 'fail',
            message: err
        }));
};
//Create new review
exports.createReview = async (req, res) => {
    const review = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    })
};
//Update review
exports.updateReview = async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
};
//Delete review
exports.deleteReview = async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    })
};