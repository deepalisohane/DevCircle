const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const ConnectionRequest = require('../../src/models/connectionRequest');
const user = require('../../src/models/user');
const { validUser } = require('../mockdata');
const userRouter = require('../../src/routes/user');

const app = express();
app.use(express.json());
app.use('/user', userRouter);
jest.mock('../../src/middleware/auth', () => {
    return (req, res, next) => {
      req.user = { _id: '609e1273fc13ae2b3c000001' }; // mock logged-in user ID
      next();
    };
  });

describe('User routes - connection APIs', () => {
    let fromUser, toUser;
    beforeEach(async () => {
        await user.deleteMany({});
        await ConnectionRequest.deleteMany({});

        fromUser = await user.create({...validUser, email: 'fromUser@gmail.com'});
        toUser = await user.create({...validUser, email: 'toUser@gmail.com'});
    });
    afterAll(async () => {
        mongoose.connection.close();
    });

    describe('GET /pendingRequests', () => {
        it('should fetch all pending connection requests for the logged-in user', async () => {
            await ConnectionRequest.create({
                fromUserId: fromUser._id,
                toUserId: '609e1273fc13ae2b3c000001',
                status: 'interested'
            });

            const response = await request(app).get('/user/pendingRequests');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Pending connection requests fetched successfully");
            expect(response.body.data.length).toBe(1);
        });
    });

    describe('GET /connections', () => {
        it('should fetch all connections for the logged-in user', async () => {
            await ConnectionRequest.create({
                fromUserId: fromUser._id,
                toUserId: '609e1273fc13ae2b3c000001',
                status: 'accepted'
            });

            const response = await request(app).get('/user/connections');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Connections fetched successfully");
            expect(response.body.data.length).toBe(1);
        });
    });
});
