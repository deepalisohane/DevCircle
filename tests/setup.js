const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Increase timeout for MongoMemoryServer setup
jest.setTimeout(30000); // 30 seconds for slow systems

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    console.log('MongoMemoryServer started:', mongoServer.getUri());
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('MongoMemoryServer setup failed:', err);
    throw err;
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    // Only drop database if connected
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped after test');
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoMemoryServer stopped');
    }
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
});