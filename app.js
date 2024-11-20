const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js");
require("dotenv").config();

// Pertemuan 7 Session dan Bycrpt
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');
const bcrypt = require('bcryptjs')

const port = process.env.PORT;

const expressLayout = require("express-ejs-layouts");

app.use(expressLayout);

const db = require('./database/db');

app.use(express.json());

// Routes untuk /todos akan ditangani oleh todo.js
app.use("/todos", todoRoutes);

// Mengatur view engine menjadi EJS
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/',authRoutes);

// Route untuk halaman utama
app.get('/', isAuthenticated, (req, res) => {

  res.render("index", {
    layout: "layouts/main-layout",
  }); // Render view index.ejs
});

// Route untuk halaman kontak
app.get("/contact", isAuthenticated,(req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout",
  }); // Render view contact.ejs
});

app.get("/todo-view", isAuthenticated,(req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      layout: "layouts/main-layout",
      todos: todos,
    });
  });
});

// Penanganan 404 untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Memulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}/`);
});
