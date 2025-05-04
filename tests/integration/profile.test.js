const request = require('supertest');
const express = require('express');
const profileRouter = require('../../src/routes/profile');
const User = require('../../src/models/user');
const cookie = require('cookie-parser');
const { validUser } = require('../mockdata');
const authMiddleware = require('../../src/middleware/auth');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cookie());
app.use('/profile', profileRouter);

jest.mock('../../src/middleware/auth');

const testUser = null;

beforeEach(async() => {
    const hashedPassword = await bcrypt.hash(validUser.password, 10);
    const testUser = new User({...validUser, password: hashedPassword });

    authMiddleware.mockImplementation((req, res, next) => {
        req.user = testUser;
        next();
    });
    await testUser.save();
});

describe('Profile Routes', () => {

    describe('GET /profile/view', () => {

        it('should return the logged-in user profile', async () => {
            const response = await request(app).get('/profile/view');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User profile fetched successfully");
            expect(response.body.user).toHaveProperty('_id');
            expect(response.body.user.email).toBe(validUser.email);
        });

        it('should reject if there is an error fetching the profile', async () => {
            authMiddleware.mockImplementationOnce((req, res, next) => {
                next(new Error("User not found"));
            });
            const response = await request(app).get('/profile/view');
            expect(response.status).toBe(500);
        });
    });
});


describe('PATCH /profile/edit', () => {
    
    it('should update the logged-in user profile', async () => {
        const response = await request(app).patch('/profile/edit').send({about: 'Updated description'});
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("John's profile updated successfully");
        expect(response.body.user.about).toBe('Updated description');
    });
    
    it('should reject if we are not abllowed to update the field', async () => {
        const response = await request(app).patch('/profile/edit').send({password: 'newpassword#123'});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Error updating user profile");
    });
});

describe('PATCH /profile/password', () => {
    it('should update the logged-in user password if old password is valid', async () => {
        const response = await request(app).patch('/profile/password').send({
            oldPassword: validUser.password,
            newPassword: 'newpassword#123'
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password updated successfully");
    });
    
    it('should reject if the old password is incorrect', async () => {
        const response = await request(app).patch('/profile/password').send({
            oldPassword: 'wrongpassword',
            newPassword: 'newpassword#123'
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Error updating password");
        expect(response.body.error).toBe("Invalid credentials");
    });

    it('should reject if inputs are missing', async () => {
        const response = await request(app).patch('/profile/password').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Error updating password");
        expect(response.body.error).toBe("Please provide both old and new passwords");
    });
});

describe('GET /profile/feed', () => {

    it('should return the feed of users', async () => {
        await User.create(validUser);
        const response = await request(app).get('/profile/feed');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });
});