const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

// Route Files
const users = require("./routes/users");

const PORT = process.env.PORT || 3000;

// Model
require("./config/db");

// Mounting Routes
app.use("/api/v1/users", users);

app.listen(PORT, function () {
  console.log("Server is running at port " + PORT);
});
