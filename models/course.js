const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: String,
  teachers: [mongoose.Schema.Types.ObjectId],
  creation_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", CourseSchema);
