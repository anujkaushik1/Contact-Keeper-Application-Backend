const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    pool: { max: 5, min: 0, idle: 10000 },
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection Established Successfully");
  })
  .catch(function (err) {
    console.log("Error : " + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

var { Users } = require("../models/User");
db.Users = Users(sequelize, DataTypes);

db.sequelize
  .sync()
  .then(function () {
    console.log("Data Inserted Successfully");
  })
  .catch(function (err) {
    console.log("Error" + err);
  });

module.exports = db;
