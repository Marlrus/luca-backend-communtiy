const User = require("../models/user");
const Question = require("../models/question");
const { updateModel } = require("../utils/modelUtils");
const {
  validateQuestionOwnership,
  findQuestionAndUser,
} = require("../utils/questionUtils");
require("../models/course");

const list = async (req, res) => {
  try {
    // Get page and limit from request or default to initial query
    const page = +req.query?.page || 1;
    const limit = +req.query?.limit || 15;
    const options = {
      page,
      limit,
      sort: { creation_date: -1 },
    };

    const questions = await Question.paginate({}, options);
    const response = {
      success: true,
      data: questions,
    };
    res.json(response);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const show = async (req, res) => {
  try {
    const foundQuestion = await Question.findById(req.params._id);
    const response = {
      success: true,
      data: foundQuestion,
    };
    res.json(response);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const create = async (req, res) => {
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
    await Question.create(questionData);
    const response = {
      success: true,
      message: "Question created successfully.",
    };
    res.json(response);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const question_id = req.params._id;
    const { user_id, question, details } = req.body;
    const [foundQuestion, foundUser] = await findQuestionAndUser({
      user_id,
      question_id,
    });

    // validate ownership becuase there is no auth middleware
    validateQuestionOwnership({ question: foundQuestion, user: foundUser });

    // update and save question
    const questionUpdates = {
      question,
      details,
    };
    const updatedQuestion = updateModel(foundQuestion, questionUpdates);
    await updatedQuestion.save();

    const response = {
      success: true,
      message: "Question updated successfully.",
    };
    res.json(response);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const deleteController = async (req, res) => {
  try {
    const question_id = req.params._id;
    const { user_id } = req.body;
    const [foundQuestion, foundUser] = await findQuestionAndUser({
      user_id,
      question_id,
    });

    // Validate ownership
    validateQuestionOwnership({ question: foundQuestion, user: foundUser });

    await foundQuestion.delete();
    const response = {
      success: true,
      message: "Question deleted successfully.",
    };
    res.json(response);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const questionController = {
  list,
  show,
  create,
  update,
  delete: deleteController,
};

module.exports = questionController;
