const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest; 