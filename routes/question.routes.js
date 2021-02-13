const router = require("express").Router({ mergeParams: true });
const User = require("../models/user");
const Question = require("../models/question");
const Course = require("../models/course");
const { updateModel } = require("../utils/modelUtils");

router.get("/", async (req, res) => {
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
    res.status(400).json(err.message);
  }
});

router.post("/", async (req, res) => {
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
    res.status(400).json(err.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const { question_id, user_id, question, details } = req.body;
    const findQuestion = Question.findById(question_id);
    const findUser = User.findById(user_id);
    // Execute queries in parallel
    const queries = [findQuestion, findUser];
    const [foundQuestion, foundUser] = await Promise.all(queries);

    // validate ownership becuase there is no auth middleware
    const questionUserId = foundQuestion.user_id;
    if (!questionUserId.equals(foundUser._id)) {
      res.status(400).json("Unauthorized operation");
    }

    // update and save question
    const questionUpdates = {
      question,
      details,
    };
    const updatedQuestion = updateModel(foundQuestion, questionUpdates);
    await updatedQuestion.save();

    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
