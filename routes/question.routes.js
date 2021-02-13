const router = require("express").Router({ mergeParams: true });
const questionController = require("../controllers/question.controllers");
require("../models/course");

router.get("/", questionController.list);

router.get("/:_id", questionController.show);

router.post("/", questionController.create);

router.put("/:_id", questionController.update);

router.delete("/:_id", questionController.delete);

module.exports = router;
