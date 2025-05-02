const express = require('express');
const connectDb = require('./config/database');  
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');


const app = express();
app.use(express.json()); // Middleware to parse JSON request body it will be executed for every API call as we have not specified any route here
app.use(cookieParser()); // Middleware to parse cookies from request headers

app.use('/auth', authRouter); 
app.use('/profile', profileRouter);
app.use('/request', requestRouter);

//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         console.log(user);
//         if(!user){
//             throw new Error("User not found in database");
//         }
//         else{
//             res.status(200).json({
//                 message: "User deleted successfully",
//             });
//         }
//     }
//     catch (err) {
//         res.status(404).json({
//             message: "Error deleting user",
//             error: err.message
//         });
//     }
// });

// app.patch('/user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const userData = req.body;
//     try {
//         const UPDATE_ALLOWED = ["age", "gender", "skills", "photoUrl", "about"];
//         const isUpdateAllowed = Object.keys(userData).every((key) => UPDATE_ALLOWED.includes(key));
//         if(!isUpdateAllowed){
//             throw new Error("Not allowed to update this field.");
//         }
//         const user = await User.findByIdAndUpdate(userId, userData, { runValidators: true });
//         console.log(user);
//         if(!user){
//             throw new Error("User not found in database"); 
//         }
//         else{
//             res.status(200).json({
//                 message: "User updated successfully",
//             });
//         }
//     } catch (err) {
//         res.status(404).json({
//             message: "Error updating user",
//             error: err.message
//         });
//     }
// });

connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connot be connected." + err);
});

