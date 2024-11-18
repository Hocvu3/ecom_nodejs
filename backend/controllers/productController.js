exports.getProducts = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
    });
};