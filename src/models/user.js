const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must contain uppercase, lowercase, number, and special character.");
            }
        }
    },
    age: {
        type: String,
        min: 13,
        max: 100,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid.");
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using DevCircle.",
        maxlength: 300,
    },
    skills: {
        type: [String],
        validate(value){
            if(value.length > 20){
                throw new Error("You can only add up to 20 skills.");
            }
        }
    },
}, {timestamps: true});

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({ id: user._id }, "DEV@circle#123", { expiresIn: '7d' });
    return token;
}

userSchema.methods.validatePassword = async function(password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}


module.exports = mongoose.model('User', userSchema);