const express = require('express');
const connectDb = require('./config/database');  
const User = require('./models/user');

const app = express();
app.use(express.json()); // Middleware to parse JSON request body it will be executed for every API call as we have not specified any route here

app.post('/signup', async (req, res) => {

    const user = new User(req.body); // Create a new user instance with the request body

    try{
    await user.save().then(() => {
        res.status(201).json({
            message: "User created successfully",
            user: user
        });
    })} catch (err){
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    };
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

connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connot be connected." + err);
});

