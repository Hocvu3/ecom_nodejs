const Wishlist = require('../models/wishlistModel');

exports.getAllWishlists = async (req, res) => {
    const wishlists = await Wishlist.find();
    res.status(200).json({
        status: 'success',
        results: wishlists.length,
        data: {
            wishlists
        }
    })
};
//Create new wishlist
exports.createWishlist = async (req, res) => {
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            wishlist
        }
    })
};
//Delete wishlist
exports.deleteWishlist = async (req, res) => {
    const wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    })
};
//Update wishlist
exports.updateWishlist = async (req, res) => {
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            wishlist
        }
    })
};
