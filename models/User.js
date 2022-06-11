const { timeStamp } = require("console");

exports.Users = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: "Please enter correct email address",
          },
        },
      },
      password: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  return users;
};
