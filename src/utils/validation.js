const validator = require('validator');

const validateUserDataForEditProfile = (data) => { 
    const UPDATE_ALLOWED = ["firstName", "lastName", "email", "age", "gender", "skills", "photoUrl", "about"];
    return Object.keys(data).every((key) => UPDATE_ALLOWED.includes(key));
};

const validatePassword = (givenpassword, storedPassword) => {
    return bcrypt.compare(givenpassword, storedPassword);
}

module.exports = {validateUserDataForEditProfile, validatePassword};