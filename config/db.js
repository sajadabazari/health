const mongoose = require("mongoose");

exports.connectToDB = () => {
    return mongoose.connect("mongodb://admin:g7w98z6mknwpjn3@remote-asiatech.runflare.com:30200/health-tkm-service");
};
