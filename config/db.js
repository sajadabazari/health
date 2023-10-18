const mongoose = require("mongoose");

exports.connectToDB = () => {
    return mongoose.connect("remote-asiatech.runflare.com:30200");
};
