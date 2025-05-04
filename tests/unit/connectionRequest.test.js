const connectionRequest = require('../../src/models/connectionRequest');
const mongoose = require('mongoose');
const { validateStatusForSendingRequest } = require('../../src/utils/validation');

describe('ConnectionRequest Model', () => {
    it('should throw error if fromUserId and toUserId are same', async () => {
        const id = new mongoose.Types.ObjectId();
        const connectionRequestInstance = new connectionRequest({
            fromUserId: id,
            toUserId: id,
            status: 'interested',
        });
        await expect(connectionRequestInstance.save()).rejects.toThrow("Cannot send connection request to self.");  
    });
});

describe('ConnectionRequest Validation', () => {
    it('should return true for valid statuses', () => {
        expect(validateStatusForSendingRequest('ignored')).toBe(true);
        expect(validateStatusForSendingRequest('interested')).toBe(true);
    });

    it('should return false for invalid statuses', () => {
        expect(validateStatusForSendingRequest('accepted')).toBe(false);
        expect(validateStatusForSendingRequest('pending')).toBe(false);
        expect(validateStatusForSendingRequest('')).toBe(false);
    });
});