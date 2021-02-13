const User = require("../models/user");
const Question = require("../models/question");

// Validate question ownership or throw err
const validateQuestionOwnership = ({ user, question }) => {
  const questionUserId = question.user_id;
  if (!questionUserId.equals(user._id)) {
    throw new Error("Unauthorized operation");
  }
};

// Finds question and user using id for validation
const findQuestionAndUser = async ({ user_id, question_id }) => {
  const findQuestion = Question.findById(question_id);
  const findUser = User.findById(user_id);
  // Execute queries in parallel
  const queries = [findQuestion, findUser];
  const [foundQuestion, foundUser] = await Promise.all(queries);
  return [foundQuestion, foundUser];
};

module.exports = {
  validateQuestionOwnership,
  findQuestionAndUser,
};
