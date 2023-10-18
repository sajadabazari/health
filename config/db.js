const mongoose = require("mongoose");

exports.connectToDB = () => {
    return mongoose.connect("mongodb://localhost:27017/health_master");
};