const mongoose = require("mongoose");

exports.connectToDB = () => {
    return mongoose.connect("mongodb://admin:g7w98z6mknwpjn3@health-tkm-service:27017/admin");
};
