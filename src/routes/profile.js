const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middleware/auth');
const User = require('../models/user'); 
const { validateUserDataForEditProfile, validatePassword } = require('../utils/validation');

profileRouter.get('/view', userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.status(200).json({
            message: "User profile fetched successfully",
            user: user
        });
    } catch (err) {
        res.status(400).json({
            message: "Error fetching user profile",
            error: err.message
        });
    }
});

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try{
        if(!validateUserDataForEditProfile(req.body)){
            throw new Error("Not allowed to update this field.");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.status(200).json({
            message: loggedInUser.firstName + "'s profile updated successfully",
            user: loggedInUser
        });
    } catch (err) {
        res.status(400).json({
            message: "Error updating user profile",
            error: err.message
        });
    }
});

profileRouter.patch('/password', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new Error("Please provide both old and new passwords");
        }
        const isPasswordValid = validatePassword(oldPassword, loggedInUser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        res.status(200).json({
            message: "Password updated successfully",
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Error updating password",
            error: err.message
        });
    }
});

profileRouter.get('/feed', async (req, res) => {
    try {
        const users = await User.find({}); 
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching users",
            error: err.message
        });
    }   
});

module.exports = profileRouter; 