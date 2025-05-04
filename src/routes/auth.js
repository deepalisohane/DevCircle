const express = require('express');
const authrouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

authrouter.post('/signup', async (req, res) => {

    try{
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        const user = new User(req.body); 
        await user.save().then(() => {
        res.status(201).json({
            message: "User created successfully",
            user: user
        });
    })} catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Email already in use",
                error: err.message
            });
        }
        res.status(500).json({
            message: "ERROR: Error creating user",
            error: err.message
        });
    };
}); 

authrouter.post('/login', async (req, res) => {
    const { email, password } = req.body; 
    try {
        const user = await User.findOne({ email });    
        if (!user) {
            throw new Error("User not found in database"); 
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const jwtToken = user.getJWT();
        res.cookie('token', jwtToken, {expires: new Date(Date.now() + 8 * 3600000)});
        res.status(200).json({
            message: "Login successful",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error while logging in", 
            error: err.message
        });
    }           
});

authrouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: "Logout successful",
    });
});

module.exports = authrouter;

