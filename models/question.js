const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const QuestionSchema = new mongoose.Schema({
  username: String,
  user_avatar: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course_name: String,
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  question: String,
  details: String,
  creation_date: { type: Date, default: Date.now },
});

QuestionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Question", QuestionSchema);
