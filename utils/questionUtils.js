// Validate question ownership or throw err
const validateQuestionOwnership = ({ user, question }) => {
  const questionUserId = question.user_id;
  if (!questionUserId.equals(user._id)) {
    throw new Error("Unauthorized operation");
  }
};

module.exports = {
  validateQuestionOwnership,
};
