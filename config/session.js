const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = session({
  store: new SQLiteStore({
    db: "sessions.sqlite",
    dir: path.join(__dirname, ".."),
  }),
  secret: process.env.SESSION_SECRET || "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "lax",
    secure: isProd, // Render uses HTTPS in production
  },
});
