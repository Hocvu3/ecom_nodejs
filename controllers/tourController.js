const express = require('express');
const Tour = require('../models/tourModel');
exports.getAllTours = async (req, res) => {
    await Tour.find()
        .then(tours => res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        }))
        .catch(err => res.status(404).json({
            status: 'fail',
            message: err
        }))
};
//Find one tour base on id
exports.getTour = async (req, res) => {
    await Tour.findById(req.params.id)
        .then(tour => res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        }))
        .catch(err => res.status(404).json({
            status: 'fail',
            message: err
        }))
};
//Create new tour
exports.createTour = async (req, res) => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
}
//Update tour
exports.updateTour = async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
}
//Delete tour
exports.deleteTour = async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    })
}