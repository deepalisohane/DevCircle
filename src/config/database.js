const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://namastedev:n1FFg6oEeDnZCEK2@nodejs.gyveeda.mongodb.net/devCircle'
    )
};

module.exports = connectDb;