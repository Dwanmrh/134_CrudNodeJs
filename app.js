const express = require("express");
const todoRoutes = require("./routes/tododb.js"); // Disesuaikan untuk memastikan impor yang benar
const app = express();
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());

// Routes untuk /todos akan ditangani oleh todo.js
app.use("/todos", todoRoutes);

// Mengatur view engine menjadi EJS
app.set("view engine", "ejs");

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.render("index"); // Render view index.ejs
});

// Route untuk halaman kontak
app.get("/contact", (req, res) => {
  res.render("contact"); // Render view contact.ejs
});

// Penanganan 404 untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Memulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}/`);
});
