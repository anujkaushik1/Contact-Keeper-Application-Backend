const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
} = require("../controller/user");
const { protect } = require("../middleware/auth"); // To check if the user is logged in

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getProfile);
router.post("/update", protect, updateProfile);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
