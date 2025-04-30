const express = require('express');
const connectDb = require('./config/database');  
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json()); // Middleware to parse JSON request body it will be executed for every API call as we have not specified any route here

app.post('/signup', async (req, res) => {

    try{
        const {password} = req.body; // Destructure password from request body
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
        req.body.password = hashedPassword; // Replace the password in the request body with the hashed password
        const user = new User(req.body); // Create a new user instance with the request body
        await user.save().then(() => {
        res.status(201).json({
            message: "User created successfully",
            user: user
        });
    })} catch (err){
        res.status(500).json({
            message: "ERORR: Error creating user",
            error: err.message
        });
    };
}); 

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from request body
    try {
        const user = await User.findOne({ email }); // Find the user by email in the database    
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
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

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (err) {
        res.status(500).json({
            message: "Error fetching users",
            error: err.message
        });
    }   
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        console.log(user);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        else{
            res.status(200).json({
                message: "User deleted successfully",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Error deleting user",
            error: err.message
        });
    }
});

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    try {
        const UPDATE_ALLOWED = ["age", "gender", "skills", "photoUrl", "about"];
        const isUpdateAllowed = Object.keys(userData).every((key) => UPDATE_ALLOWED.includes(key));
        if(!isUpdateAllowed){
            return res.status(400).json({
                message: "Invalid update fields",
            });
        }
        const user = await User.findByIdAndUpdate(userId, userData, { runValidators: true });
        console.log(user);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            }); 
        }
        else{
            res.status(200).json({
                message: "User updated successfully",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Error updating user",
            error: err.message
        });
    }
});

connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connot be connected." + err);
});

