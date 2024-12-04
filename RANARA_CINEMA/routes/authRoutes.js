const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const router = express.Router();

// Route untuk menampilkan form signup
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/main-layout",
  });
});

// Route Signup
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Simpan user ke database tanpa hashing
    db.query(
      "INSERT INTO user (username, password, email) VALUES (?, ?, ?)",
      [username, password, email],
      (err) => {
        if (err) {
          console.error("Database Error (Signup):", err.message);
          return res.status(500).send("Error registering user");
        }
        req.session.successMessage = "Registration successful! Please login.";
        res.redirect("/login"); // Arahkan ke halaman login
      }
    );
  } catch (err) {
    console.error("Error (Signup):", err.message);
    res.status(500).send("Server Error");
  }
});

// Route untuk menampilkan form login
router.get("/login", (req, res) => {
  const successMessage = req.session.successMessage;
  req.session.successMessage = null; // Hapus pesan setelah ditampilkan
  res.render("login", {
    layout: "layouts/main-layout",
    successMessage,
  });
});

// Route Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Cari user berdasarkan username
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database Error (Login):", err.message);
        return res.status(500).send("Error fetching user");
      }

      // Jika user tidak ditemukan
      if (results.length === 0) {
        return res.status(400).send("Invalid username or password");
      }

      const user = results[0];

      // Bandingkan password yang diinput dengan password yang disimpan
      if (password !== user.password) {
        return res.status(400).send("Invalid username or password");
      }

      // Jika password benar
      req.session.userUsername = user.username; // Simpan session
      res.redirect("/home"); // Redirect ke halaman utama
    }
  );
});

// Route Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error (Logout):", err.message);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login"); // Arahkan ke halaman login setelah logout
  });
});

module.exports = router;
