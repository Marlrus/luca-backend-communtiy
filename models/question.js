const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  username: String,
  user_id: mongoose.Schema.Types.ObjectId,
  course_name: String,
  course_id: mongoose.Schema.Types.ObjectId,
  question: String,
  details: String,
  creation_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);
