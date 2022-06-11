const db = require("../config/db");
const Users = db.Users;
const bcrypt = require("bcryptjs");

exports.register = async function (req, res) {
  try {
    const body = req.body;

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    let data = await Users.build(body);
    const user = await data.save();

    res.status(200).json({
      success: true,
      msg: "User Registered Successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
