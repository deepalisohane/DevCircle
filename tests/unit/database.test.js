const mongoose = require('mongoose');
const connectDb = require('../../src/config/database');

describe('Database Connection', () => {
  // Ensure each test has its own timeout
  jest.setTimeout(10000); // 10 seconds per test

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Disconnect Mongoose to avoid open handles
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  it('should connect to MongoDB successfully', async () => {
    const spy = jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.resolve());
    console.log('Connecting to MongoDB...');
    await expect(connectDb()).resolves.toBeUndefined();
    console.log('Connected to MongoDB successfully');
    expect(spy).toHaveBeenCalledWith(process.env.MONGODB_URI);
    spy.mockRestore();
  });

  it('should throw an error if connection fails', async () => {
    const error = new Error('Connection failed');
    console.log('Simulating connection failure...');
    jest.spyOn(mongoose, 'connect').mockImplementation(() => Promise.reject(error));
    await expect(connectDb()).rejects.toThrow('Connection failed');
    jest.spyOn(mongoose, 'connect').mockRestore();
  });
});