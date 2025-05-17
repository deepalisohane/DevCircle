const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middleware/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { USER_SAFE_DATA } = require('../utils/constants');


//Get all the pending connection requests for the logged in user
userRouter.get('/pendingRequests', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const pendingRequests = await ConnectionRequest.find
        ({ 
            toUserId: loggedInUserId, 
            status: 'interested' 
        }).populate('fromUserId', USER_SAFE_DATA);

        res.status(200).json({
            message: "Pending connection requests fetched successfully",
            data: pendingRequests
        });
    } catch (err) {
        res.status(400).json({
            message: "Error fetching pending connection requests",
            error: err.message
        });
    }
});

//Get all connections for the logged in user
userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUserId, status: 'accepted' },
                { fromUserId: loggedInUserId, status: 'accepted' }
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA);
        // Filter out the logged-in user from the connections
        const connectedUser = connections.map(connections => {
            const isSender = connections.fromUserId._id.toString() === loggedInUserId.toString();
            const otherUser = isSender ? connections.toUserId : connections.fromUserId;
            const safeUserData = {};
            USER_SAFE_DATA.forEach(field => {
                safeUserData[field] = otherUser[field];
            });
            return safeUserData;
        });

        res.status(200).json({
            message: "Connections fetched successfully",
            data: connectedUser
        });
    } catch (err) {
        res.status(400).json({
            message: "Error fetching connections",
            error: err.message
        });
    }
});

module.exports = userRouter;