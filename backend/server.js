const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
// Set up config file
dotenv.config({ path: 'backend/config/config.env' });
// Connect to database
connectDatabase.connectDatabase();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});