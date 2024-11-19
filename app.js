const express = require("express");
const app = express();
const dotenv = require("dotenv");

app.use((req,res,next) => {
    console.log("Hello from middleware");
    next();
});

module.exports = app;