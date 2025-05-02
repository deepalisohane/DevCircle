const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { validateStatusForSendingRequest } = require('../utils/validation');
const User = require('../models/user');

requestRouter.post('/send/:status/:touserid', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.touserid;
        const status = req.params.status;
        if (!fromUserId || !toUserId) {
            return res.status(400).json({ message: "fromUserId and toUserId are required" });
        }   
        const checkStatusIsValidForSendingRequest = validateStatusForSendingRequest(status);
        if (!checkStatusIsValidForSendingRequest) {
            return res.status(400).json({ message: "Invalid status for sending request: status should be 'pending' or 'interested' and is: " + status });
        }
        //check if toUserId is valid
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ message: "Invalid toUserId, not found" });
        }
        // Check if the connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId }, 
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.status(201).json({
            message: `Connection request sent from ${req.user.firstName} to ${toUser.firstName} with status '${status}'`,
            data: data
        });
    } catch (err) {
        res.status(400).json({
            message: "Error processing request",
            error: err.message
        });
    }
});

module.exports = requestRouter;