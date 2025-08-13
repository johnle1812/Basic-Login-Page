const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
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
      res.status(201).redirect("/home");
    }

    console.log(newUser);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("Internal Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("User does not exist");
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
          return res.status(401).send("Unauthorized");
        }
        console.log("JWT verified successfully:", decoded);
      });
      res.cookie("token", token, { httpOnly: true });
      res.status(200).redirect("/home");
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { registerUser, loginUser };
