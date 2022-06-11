const db = require("../config/db");
const Users = db.Users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function sendTokenResponse(user, statusCode, res) {
  const token = getSignedJwtToken(user.id);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
    data: user,
  });
}

function getSignedJwtToken(id) {
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

    sendTokenResponse(user, 200, res);
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
    const isPassword = await bcrypt.compare(password, dbPassword);
    console.log(isPassword);

    if (!isPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getProfile = async function (req, res) {
  try {
    const user = await Users.findAll({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        msg: "Please enter correct credentials",
      });
    }

    let data = user[0].dataValues;
    const results = {
      id: data.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const id = req.user[0].dataValues.id;

    const user = await Users.update(fieldsToUpdate, {
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        msg: "Please enter correct credentials",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = async function (req, res) {
  try {
    let { email, password, confirmPassword } = req.body;
    const user = await Users.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
     return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        msg: "Password does not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const updatedData = await Users.update(
      { password },
      {
        where: {
          email: email,
        },
      }
    );
    return res.status(200).json({
      success: true,
      data: updatedData,
      msg: "Password changed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success : false,
      error : error.message
    })
  }
};
