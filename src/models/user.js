const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Not a valid gender.");
            }
        }
    },
    photoUrl: {
        type: String,
    },
    about: {
        type: String,
        default: "Hey there! I am using DevCircle.",
    },
    skills: {
        type: [String],
    },
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);