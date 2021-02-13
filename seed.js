const faker = require("faker");
const User = require("./models/user");
const Course = require("./models/course");
const Question = require("./models/question");
const {
  range,
  removeLastChar,
  getRandomElementInArray,
} = require("./utils/generalUtils");

const seedDb = async () => {
  try {
    // Parallel deletion of previous seeds Uncomment to wipe db and re-seed
    const deleteUsers = User.deleteMany();
    const deleteCourses = Course.deleteMany();
    const deleteQuestions = Question.deleteMany();
    await Promise.all([deleteUsers, deleteCourses, deleteQuestions]);
    console.log("Db erased");

    // Verify existing data and return
    const existingCourse = await Course.find();
    if (existingCourse.length > 0) return console.log("Data found");

    const courseData = {
      name: "Matemáticas 6º",
    };

    // Create course that will be pushed into user courses
    const newCourse = new Course(courseData);
    console.log("Course Created");
    newCourse.save();

    const userQuantity = 50;

    const users = [];

    range(userQuantity).forEach(async () => {
      const mockUser = {
        name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.internet.avatar(),
      };

      const newUser = new User(mockUser);
      // Add course ref to user and send to users array
      newUser.courses.push(newCourse._id);
      users.push(newUser);
      await newUser.save();
    });
    console.log("Users Created");

    const courseName = newCourse.name;
    const courseId = newCourse._id;

    const questionQuantity = 300;

    range(questionQuantity).forEach(async () => {
      const loremQuestion = removeLastChar(faker.lorem.sentence());
      const { username, _id, avatar } = getRandomElementInArray(users);
      const mockQuestion = {
        question: `¿${loremQuestion}?`,
        details: faker.lorem.paragraph(),
        username,
        user_avatar: avatar,
        user_id: _id,
        course_name: courseName,
        course_id: courseId,
      };
      const newQuestion = new Question(mockQuestion);
      await newQuestion.save();
    });
    console.log("Questions created");
    console.log("Database Seeded");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { seedDb };
