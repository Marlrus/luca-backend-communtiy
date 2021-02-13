const User = require("../models/user");
const Question = require("../models/question");
const { updateModel } = require("../utils/modelUtils");
const { validateQuestionOwnership } = require("../utils/questionUtils");
require("../models/course");

const get = async (req, res) => {
  try {
    // Get page and limit from request or default to initial query
    const page = +req.query?.page || 1;
    const limit = +req.query?.limit || 15;
    const options = {
      page,
      limit,
      sort: { creation_date: "desc" },
    };

    const questions = await Question.paginate({}, options);
    res.json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const post = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id)
      .populate("courses")
      .exec();
    // The course would be chosen based on the id for the course in the payload
    const course = user.courses[0];
    const { username, avatar } = user;
    const { question, details } = req.body;
    const questionData = {
      username,
      user_avatar: avatar,
      user_id: user._id,
      course_name: course.name,
      course_id: course._id,
      question,
      details,
    };
    const newQuestion = await Question.create(questionData);
    res.json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const put = async (req, res) => {
  try {
    const { question_id, user_id, question, details } = req.body;
    const findQuestion = Question.findById(question_id);
    const findUser = User.findById(user_id);
    // Execute queries in parallel
    const queries = [findQuestion, findUser];
    const [foundQuestion, foundUser] = await Promise.all(queries);

    // validate ownership becuase there is no auth middleware
    validateQuestionOwnership({ question: foundQuestion, user: foundUser });

    // update and save question
    const questionUpdates = {
      question,
      details,
    };
    const updatedQuestion = updateModel(foundQuestion, questionUpdates);
    await updatedQuestion.save();

    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteController = async (req, res) => {
  try {
    const { question_id, user_id } = req.body;
    const findQuestion = Question.findById(question_id);
    const findUser = User.findById(user_id);
    // Execute queries in parallel
    const queries = [findQuestion, findUser];
    const [foundQuestion, foundUser] = await Promise.all(queries);

    // Validate ownership
    validateQuestionOwnership({ question: foundQuestion, user: foundUser });

    await foundQuestion.delete();
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const questionController = {
  get,
  post,
  put,
  delete: deleteController,
};

module.exports = questionController;
