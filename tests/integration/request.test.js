const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const ConnectionRequest = require('../../src/models/connectionRequest');
const express = require('express');
const jwtToken = require('jsonwebtoken');
const authMiddleware = require('../../src/middleware/auth');
const { validUser } = require('../mockdata');
const requestRouter = require('../../src/routes/request');

const app = express();
app.use(express.json());
app.use('/request', requestRouter);

jest.mock('../../src/middleware/auth');

describe('Connection Request Routes', () => {
    let fromUser, toUser;

    beforeEach(async () => {
        fromUser = await new User({ ...validUser, email: 'bob@gmail.com' }).save();
        toUser = await new User({ ...validUser, email: 'alice@gmail.com' }).save();

        authMiddleware.mockImplementation((req, res, next) => {
            req.user = fromUser;
            next();
        });

        await ConnectionRequest.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it('should create a connection request with valid input', async () => {
        const id = toUser._id.toString();
        const response = await request(app).post(`/request/send/interested/${id}`);
        console.log('Response:', response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.status).toBe('interested');
        expect(response.body.message).toBe(`Connection request sent from ${fromUser.firstName} to ${toUser.firstName} with status 'interested'`);
        expect(response.body.data.fromUserId).toBe(fromUser._id.toString());
        expect(response.body.data.toUserId).toBe(toUser._id.toString());
    });

    it('should not create a connection request if fromUserId and toUserId are the same', async () => {
        const id = fromUser._id.toString();
        const response = await request(app).post(`/request/send/interested/${id}`);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Cannot send connection request to self.");
    });

    it('should not create a connection request if the status is invalid', async () => {
        const id = toUser._id.toString();
        const response = await request(app).post(`/request/send/invalidStatus/${id}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid status for sending request: status should be 'pending' or 'interested' and is: invalidStatus");
    });

    it('should not create a connection request if the toUserId is invalid', async () => {
        const id = '681279d01a70d10ead88a000';
        const response = await request(app).post(`/request/send/interested/${id}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid toUserId, not found");
    });

    it('should not create a connection request if it already exists', async () => {
        const fromUserId = fromUser._id.toString();
        const toUserId = toUser._id.toString();
        await ConnectionRequest.create({ fromUserId: fromUserId, toUserId: toUserId, status: 'interested' });
        const res = await request(app).post(`/request/send/interested/${toUser._id}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Connection request already exists');
    });
});
