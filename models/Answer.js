const mongoose = require("mongoose");
const Answer = mongoose.model("Answer", {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  file: String,
  seen: { type: Boolean, default: false },
});

module.exports = Answer;
