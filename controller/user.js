const db = require("../config/db");
const Users = db.Users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function getSignedJwtToken(id) {
  console.log(id);
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

exports.register = async function (req, res) {
  try {
    const body = req.body;

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    let data = await Users.build(body);
    const user = await data.save();

    // Create Token
    const token = getSignedJwtToken(user.id);

    res.status(200).json({
      success: true,
      msg: "User Registered Successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        msg: "Please provide an email and password",
      });
    }

    const user = await Users.findAll({
      where: {
        email: email,
      },
    });

    if (user.length == 0) {
      res.status(401).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    const dbPassword = user[0].dataValues.password;
    console.log(dbPassword);
    const isPassword = bcrypt.compare(password, dbPassword);

    if (!isPassword) {
      res.status(401).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    const token = getSignedJwtToken(user.id);

    res.status(200).json({
      success: true,
      msg: "User Logged in Successfully",
      token: token,
    });


  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
