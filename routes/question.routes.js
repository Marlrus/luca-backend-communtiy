const router = require("express").Router({ mergeParams: true });
const questionController = require("../controllers/question.controlers");
require("../models/course");

router.get("/", questionController.get);

router.post("/", questionController.post);

router.put("/", questionController.put);

router.delete("/", questionController.delete);

module.exports = router;
