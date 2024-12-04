const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./database/db"); // File koneksi database
const app = express();

// Konfigurasi EJS dan body-parser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware dan konfigurasi
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("views", "./views");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.render("index"); // Pastikan Anda memiliki file views/index.ejs
});
