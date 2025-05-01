const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token) {
            throw new Error("Token not found in cookies");
        }
        const decodedMessage = await jwt.verify(token, "DEV@circle#123");
        const { id } = decodedMessage;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found in database");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Unauthorized access",
            error: err.message
        });
    }
}

module.exports = userAuth;