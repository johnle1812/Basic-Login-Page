require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./db/db");
const userRoutes = require("./routes/routes");
const {
  attachUserIfPresent,
  requireAuth,
  requireAdmin,
} = require("./middleware/auth");

connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(attachUserIfPresent);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }

  res.render("login", {
    pageTitle: "Welcome Back",
    error: req.query.error || "",
    success: req.query.success || "",
  });
});

app.get("/signup", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }

  res.render("signup", {
    pageTitle: "Create Account",
    error: req.query.error || "",
    success: req.query.success || "",
  });
});

app.get("/home", requireAuth, (req, res) => {
  res.render("homepage", {
    username: req.user.username,
    role: req.user.role,
    success: req.query.success || "",
  });
});

app.get("/admin", requireAdmin, (req, res) => {
  res.render("admin", {
    username: req.user.username,
    role: req.user.role,
  });
});

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
