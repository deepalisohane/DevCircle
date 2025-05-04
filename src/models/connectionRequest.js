const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'ignored', 'interested'],
    },
}, {timestamps: true});

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if(connectionRequest.toUserId.toString() === connectionRequest.fromUserId.toString()){
        return next(new Error("Cannot send connection request to self."));
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest; 