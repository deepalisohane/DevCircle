const express = require('express');
const connectDb = require('./config/database');  
const User = require('./models/user');

const app = express();

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Deepali",
        lastName: "Sohane",
        email: "ds@gmail.com",
        password: "Ds123",
        age: 21
    });

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


connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connot be connected." + err);
});

