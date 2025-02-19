const express = require("express");
const app = express();
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');
const saveMessage = require("./controllers/chatController");
app.use(hpp());
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());

// create server
const server = http.createServer(app);
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('sendMessage', async ({ sender, recipient, content }) => {
        console.log(`Message from ${sender} to ${recipient}: ${content}`);
    
        // Save message to the database
        await saveMessage(sender, recipient, content);
    
        // Emit message to the recipient
        socket.broadcast.emit('receiveMessage', { sender, recipient, content });
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
});
//added other middlewares
//limiter
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
});
app.use('/api', limiter);


// routes
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/chats", chatRoutes);


module.exports = app;