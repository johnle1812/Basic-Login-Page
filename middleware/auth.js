const jwt = require("jsonwebtoken");
const User = require("../models/User");

const parseCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
};

const getTokenFromRequest = (req) => {
  const cookies = parseCookies(req.headers.cookie);
  return cookies.token;
};

const attachUserIfPresent = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("username role");

    if (!user) {
      req.user = null;
      res.clearCookie("token");
      return next();
    }

    req.user = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    req.user = null;
    res.clearCookie("token");
  }

  return next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/?error=Please+log+in+to+continue.");
  }

  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/?error=Please+log+in+to+continue.");
  }

  if (req.user.role !== "admin") {
    return res.status(403).render("forbidden", {
      username: req.user.username,
      role: req.user.role,
    });
  }

  return next();
};

module.exports = {
  attachUserIfPresent,
  requireAuth,
  requireAdmin,
};
