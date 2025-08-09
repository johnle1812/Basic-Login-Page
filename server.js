const { log } = require("console");
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./db/db");

connectDB();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
