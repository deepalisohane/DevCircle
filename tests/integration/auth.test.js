const request = require('supertest');
const express = require('express');
const User = require('../../src/models/user');
const authRouter = require('../../src/routes/auth');
const cookie = require('cookie-parser');
const {validUser, invalidUser} = require('../mockdata');

const app = express();
app.use(express.json());
app.use(cookie());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
    describe('POST auth/signup', () => {
        it('should create a new user with valid data', async () => {
            
            const response = await request(app).post('/auth/signup').send(validUser);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("User created successfully");
            expect(response.body.user.email).toBe(validUser.email);
            const user = await User.findOne({ email: validUser.email });
            expect(user).toBeDefined();
        });
        it('should not create a user with invalid data', async () => {
            const response = await request(app).post('/auth/signup').send(invalidUser);
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("ERORR: Error creating user");
        });
        //currently, the test is failing
        it('should fail with duplicate email', async () => {
            await new User(validUser).save();
            const response = await request(app).post('/auth/signup').send(validUser);
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("ERORR: Error creating user");
        });
    });
});

describe('POST auth/login', () => {
    beforeEach(async () => {
        const user = new User(validUser);
        user.password = await require('bcryptjs').hash(validUser.password, 10);
        await user.save();
    });
    it('should log in a user with valid credentials', async () => {
        const response = await request(app).post('/auth/login').send({
            email: validUser.email,
            password: validUser.password,
        });
        console.log(response.headers['set-cookie']);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.headers['set-cookie'][0]).toBeDefined();
    });
    it('should not log in a user with invalid credentials', async () => {
        const response = await request(app).post('/auth/login').send({
            email: validUser.email,
            password: 'wrongpassword',
        });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error while logging in");
    });
});

describe('POST auth/logout', () => {
    it('should log out a user', async () => {
        const response = await request(app).post('/auth/logout');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Logout successful");
        expect(response.headers['set-cookie'][0]).toContain('token=;');
    });
});
