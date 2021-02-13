const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  username: String,
  email: String,
  avatar: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  enrollment_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
