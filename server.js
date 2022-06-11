const express = require("express");
const app = express();
const dotenv = require("dotenv");

// Route Files
const users = require('./routes/users');

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });


const PORT = process.env.PORT || 3000;

// Model
require('./config/db');

// Mounting Routes
app.use('/api/v1/users', users);


app.listen(PORT, function () {
  console.log("Server is running at port " + PORT);
});
