const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../../src/models/user');
const jwtToken = require('jsonwebtoken');
const {validUser, invalidUser} = require('../mockdata');
const {validatePassword} = require('../../src/utils/validation');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a user with valid data', async () => {
        const user = new User(validUser);
        await expect(user.save()).resolves.toBeDefined();
        expect(user.email).toBe(validUser.email);
    });
    it('should not create a user with invalid data', async () => {
        const user = new User(invalidUser);
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    it('should fail if fields are missing', async () => {  
        const user = new User({}); // Empty object to trigger validation error
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    it('should fail if password is not strong enough', async () => {
        const weakPasswordUser = new User({ ...validUser, password: '123' });
        await expect(weakPasswordUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
  });
});
