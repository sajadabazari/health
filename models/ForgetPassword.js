const mongoose = require("mongoose");
const ForgetPassword = mongoose.model("ForgetPassword", {
  user: String,
  key: String,
});

module.exports = ForgetPassword;
