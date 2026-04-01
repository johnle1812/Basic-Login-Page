const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const redirectWithMessage = (res, path, type, message) => {
  const params = new URLSearchParams({ [type]: message });
  return res.redirect(`${path}?${params.toString()}`);
};

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return redirectWithMessage(
        res,
        "/signup",
        "error",
        "That username is already taken."
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user and save to mongoDB
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      return res.redirect(
        `/home?username=${encodeURIComponent(newUser.username)}`
      );
    }

    console.log(newUser);
  } catch (error) {
    console.error("Error during user registration:", error);
    return redirectWithMessage(
      res,
      "/signup",
      "error",
      "We couldn't create your account. Please try again."
    );
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return redirectWithMessage(
        res,
        "/",
        "error",
        "We couldn't find an account with that username."
      );
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role || "user",
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err);
          return redirectWithMessage(
            res,
            "/",
            "error",
            "Your session could not be created."
          );
        }
        console.log("JWT verified successfully:", decoded);
      });
      res.cookie("token", token, { httpOnly: true });
      return res.redirect(`/home?username=${encodeURIComponent(user.username)}`);
    } else {
      return redirectWithMessage(
        res,
        "/",
        "error",
        "Your password didn't match. Please try again."
      );
    }
  } catch (error) {
    console.error("Error during user login:", error);
    return redirectWithMessage(
      res,
      "/",
      "error",
      "Something went wrong while logging you in."
    );
  }
};

module.exports = { registerUser, loginUser };
