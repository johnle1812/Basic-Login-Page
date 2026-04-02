const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/controller");
const router = express.Router();

// Route for user registration
router.post("/signup", registerUser);
// Route for user login
router.post("/login", loginUser);
// Route for user logout
router.post("/logout", logoutUser);

module.exports = router;
