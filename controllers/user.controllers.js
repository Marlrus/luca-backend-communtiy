const User = require("../models/user");

const get = async (_, res) => {
  try {
    const user = await User.findOne();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const userController = {
  get,
};

module.exports = userController;
