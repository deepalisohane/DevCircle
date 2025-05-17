const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { validateStatusForSendingRequest, validateStatusForReviewingRequest } = require('../utils/validation');
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
            message: "Error processing send connection request",
            error: err.message
        });
    }
});


requestRouter.post('/review/:status/:requestid', userAuth, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const requestId = req.params.requestid;
        const status = req.params.status;

        const checkStatusIsValidForReviewingRequest = validateStatusForReviewingRequest(status);
        if (!checkStatusIsValidForReviewingRequest) {
            return res.status(400).json({ message: "Invalid status for reviewing request: status should be 'accepted' or 'rejected' and is: " + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId._id,
            status: 'interested'
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found or already reviewed" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({
            message: `Connection request ${status} by ${req.user.firstName}`,
            data: data
        }); 

    }catch (err) { 
        return res.status(400).json({
            message: "Error processing review connection request",
            error: err.message
        });
    }
    
});

module.exports = requestRouter;