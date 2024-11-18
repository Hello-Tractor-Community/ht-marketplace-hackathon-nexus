// config/db.js
const mongoose = require('mongoose');
  // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
const connectWithRetry = async () => {
    try {
        // console.log(process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
          
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Retry connection after 5 seconds
        setTimeout(connectWithRetry, 5000);
    }
};

// Graceful shutdown helper
const closeConnection = () => {
    return mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
    });
};

module.exports = { 
    connectWithRetry,
    closeConnection
};