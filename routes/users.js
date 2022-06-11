const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controller/user");
const { protect } = require("../middleware/auth");  // To check if the user is logged in

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getProfile);
router.post("/update", protect, updateProfile);

module.exports = router;
