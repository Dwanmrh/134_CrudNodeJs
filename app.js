// Menggunakan Express
const express = require("express");
const todoRoutes = require("./routes/todo.js");
const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Menggunakan routes untuk todos
app.use("/todos", todoRoutes);

// Set view engine ke EJS
app.set("view engine", "ejs");

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.render("index");
});

// Route untuk halaman contact
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Middleware untuk menangani 404 (halaman tidak ditemukan)
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
