const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Set up JWT secret for testing
process.env.JWT_SECRET = 'test-secret-key';

// Define a global beforeAll hook
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('[TEST SETUP] Connected to in-memory database');
  } catch (error) {
    console.error('[TEST SETUP] MongoDB connection error:', error);
    throw error;
  }
});

// Clean up after all tests are done
afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('[TEST SETUP] Disconnected from in-memory database');
  } catch (error) {
    console.error('[TEST SETUP] Cleanup error:', error);
    throw error;
  }
});

// Clear all test data after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    console.log('[TEST SETUP] Cleared all test data');
  } catch (error) {
    console.error('[TEST SETUP] Data cleanup error:', error);
    throw error;
  }
});

// Handle test environment setup errors
process.on('unhandledRejection', (error) => {
  console.error('[TEST SETUP] Unhandled Promise Rejection:', error);
});