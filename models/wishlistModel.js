const express = require('express');
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: [true, 'Wishlist must belong to a user']
    },
    tour: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Tour',
        required: [true, 'Wishlist must belong to a tour']
    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);