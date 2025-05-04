const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../../src/models/user');
const jwtToken = require('jsonwebtoken');
const {validUser, invalidUser} = require('../mockdata');
const { validateUserDataForEditProfile } = require('../../src/utils/validation');

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

    it('should fail if required fields are missing', async () => {  
        const user = new User({...validUser, email: ' ' }); 
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail if password is not strong enough', async () => {
        const weakPasswordUser = new User({ ...validUser, password: '123' });
        await expect(weakPasswordUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('firstName or lastName should not be empty or less than 2 characters or greater than 50 character', async () => {
        const user = new User({ ...validUser, firstName: 'A' });
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
        const user2 = new User({ ...validUser, lastName: 'B' });
        await expect(user2.save()).rejects.toThrow(mongoose.Error.ValidationError);
        const user3 = new User({ ...validUser, firstName: 'A'.repeat(51) });
        await expect(user3.save()).rejects.toThrow(mongoose.Error.ValidationError);
        const user4 = new User({ ...validUser, lastName: 'B'.repeat(51) });
        await expect(user4.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail if email is not valid', async () => {
        const user = new User({ ...validUser, email: 'invalidEmail' });
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail if skills array has more than 20 items', async () => {
        const user = new User({ ...validUser, skills: Array(21).fill('react') });
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should not able to update the not allowed fields', async () => {
        expect(validateUserDataForEditProfile('password')).toBe(false);
        expect(validateUserDataForEditProfile(' ')).toBe(false);
    });
  });
});
