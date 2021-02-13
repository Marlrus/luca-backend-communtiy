const router = require("express").Router({ mergeParams: true });
const userController = require("../controllers/user.controllers");

router.get("/", userController.get);

module.exports = router;
