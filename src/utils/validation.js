const validator = require('validator');
const bcrypt = require('bcryptjs');

const validateUserDataForEditProfile = (data) => { 
    const UPDATE_ALLOWED = ["firstName", "lastName", "email", "age", "gender", "skills", "photoUrl", "about"];
    return Object.keys(data).every((key) => UPDATE_ALLOWED.includes(key));
};

const validatePassword = (givenpassword, storedPassword) => {
    return bcrypt.compare(givenpassword, storedPassword);
}

const validateStatusForSendingRequest = (status) => {
    const VALID_STATUSES = ['ignored', 'interested'];
    return VALID_STATUSES.includes(status);
};

const validateStatusForReviewingRequest = (status) => {
    const VALID_STATUSES = ['accepted', 'rejected'];
    return VALID_STATUSES.includes(status);
};

module.exports = {
    validateUserDataForEditProfile, validatePassword, validateStatusForSendingRequest, validateStatusForReviewingRequest
};