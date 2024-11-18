const express = require('express');
const app = express();
app.use(express.json());


const productRoutes = require('./routes/productRoute');
app.use('/api/v1/products', productRoutes);

module.exports = app;