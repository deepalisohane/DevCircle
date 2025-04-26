const express = require('express');

const app = express();

const {adminAuth} = require('./middleware/auth');

app.use("/admin", adminAuth);

app.get("/user", (req, res) => {
    res.send("user data sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});