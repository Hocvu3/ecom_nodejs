const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty!"]
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        required: [true, 'Rating is required']    
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    tour: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;