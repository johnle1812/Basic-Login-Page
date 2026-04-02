const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const redirectWithMessage = (res, path, type, message) => {
  const params = new URLSearchParams({ [type]: message });
  return res.redirect(`${path}?${params.toString()}`);
};

const issueAuthCookie = (res, user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role || "user",
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  return token;
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
      issueAuthCookie(res, newUser);
      return redirectWithMessage(
        res,
        "/home",
        "success",
        "Your account has been created and you are now signed in."
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
      issueAuthCookie(res, user);
      return redirectWithMessage(
        res,
        "/home",
        "success",
        "You have logged in successfully."
      );
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

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return redirectWithMessage(
    res,
    "/",
    "success",
    "You have been logged out."
  );
};

module.exports = { registerUser, loginUser, logoutUser };
