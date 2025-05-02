const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
    }
    catch(err){
        console.error("Error connecting to MongoDB:", err.message);
        throw new Error("Connection failed");
    }
};

module.exports = connectDb;