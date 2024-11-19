const express = require("express");
const app = express();
const dotenv = require("dotenv");

// app.use((req,res,next) => {
//     console.log("Hello from middleware");
//     next();
// });


// routes
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);


module.exports = app;