const mongoose = require('mongoose');

exports.connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Database connected successfully'); 
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
}