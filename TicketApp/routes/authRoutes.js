const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");
const router = express.Router();

// Halaman login
router.get("/login", (req, res) => {
  res.render("/views/login.ejs", { error: null });
});

// Proses login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [user] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    return res.redirect(user.role === "admin" ? "/admin" : "/user");
  }
  res.render("views/login", { error: "Username atau password salah" });
});

// Halaman signup
router.get("/signup", (req, res) => {
  res.render("/views/signup.ejs", { error: null });
});

// Proses signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    res.redirect("/login");
  } catch (err) {
    res.render("views/signup", { error: "Username sudah terdaftar!" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
