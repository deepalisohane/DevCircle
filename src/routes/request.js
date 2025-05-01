const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middleware/auth');

requestRouter.post('/sendconnections', userAuth, async (req, res) => {
    try {
        const { userId, requestType } = req.body;
        
    } catch (err) {
        res.status(400).json({
            message: "Error processing request",
            error: err.message
        });
    }
});

module.exports = requestRouter;