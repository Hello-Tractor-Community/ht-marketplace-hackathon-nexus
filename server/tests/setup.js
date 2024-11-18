const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Set up environment variables for testing
process.env.JWT_SECRET = '74390bcd52e1abab1bad655b94f2260a8ecc845132dfa90132e28ca877ff413c';
process.env.NODE_ENV = 'test';

// Connect to the in-memory database
module.exports.connect = async () => {
    try {
        // Check if there is an active connection and close it
        if (mongoose.connection.readyState !== 0) {
            console.log('[TEST SETUP] Closing existing connection before opening a new one');
            await mongoose.disconnect();
        }

        // Create a new MongoMemoryServer instance
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        // Connect with recommended options for MongoDB 6+
        await mongoose.connect(uri, {
            // Add only if using older versions of mongoose
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });

        console.log('[TEST SETUP] Connected to in-memory database');
    } catch (error) {
        console.error('[TEST SETUP] Connection error:', error);
        throw error;
    }
};

// Close database connection
module.exports.closeDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            await mongod.stop();
            console.log('[TEST SETUP] Disconnected from in-memory database');
        }
    } catch (error) {
        console.error('[TEST SETUP] Cleanup error:', error);
        throw error;
    }
};

// Clear all data in the database
module.exports.clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
        console.log('[TEST SETUP] Cleared all test data');
    } catch (error) {
        console.error('[TEST SETUP] Clear database error:', error);
        throw error;
    }
};

// Optional: Add helper function for test data creation
module.exports.createTestData = async (model, data) => {
    try {
        const created = await model.create(data);
        return created;
    } catch (error) {
        console.error('[TEST SETUP] Test data creation error:', error);
        throw error;
    }
};