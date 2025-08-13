require("dotenv").config();

const { log } = require("console");
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./db/db");
const userRoutes = require("./routes/routes");

connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("homepage");
});

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
