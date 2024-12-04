const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Middleware untuk memastikan hanya admin yang bisa mengakses
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.redirect("/login");
}

// Halaman daftar film
router.get("/", isAdmin, async (req, res) => {
  const [films] = await db.query("SELECT * FROM films");
  res.render("admin/films", { films });
});

// Halaman tambah film
router.get("/add", isAdmin, (req, res) => {
  res.render("admin/addFilm", { error: null });
});

// Proses tambah film
router.post("/add", isAdmin, async (req, res) => {
  const { title, description, image } = req.body;
  try {
    await db.query("INSERT INTO films (title, description, image) VALUES (?, ?, ?)", [
      title,
      description,
      image,
    ]);
    res.redirect("/admin");
  } catch (err) {
    res.render("admin/addFilm", { error: "Gagal menambahkan film." });
  }
});

// Halaman edit film
router.get("/edit/:id", isAdmin, async (req, res) => {
  const [film] = await db.query("SELECT * FROM films WHERE id = ?", [req.params.id]);
  if (film.length > 0) {
    res.render("admin/editFilm", { film: film[0], error: null });
  } else {
    res.redirect("/admin");
  }
});

// Proses edit film
router.post("/edit/:id", isAdmin, async (req, res) => {
  const { title, description, image } = req.body;
  try {
    await db.query("UPDATE films SET title = ?, description = ?, image = ? WHERE id = ?", [
      title,
      description,
      image,
      req.params.id,
    ]);
    res.redirect("/admin");
  } catch (err) {
    res.render("admin/editFilm", { error: "Gagal mengedit film.", film: req.body });
  }
});

// Proses hapus film
router.get("/delete/:id", isAdmin, async (req, res) => {
  await db.query("DELETE FROM films WHERE id = ?", [req.params.id]);
  res.redirect("/admin");
});

module.exports = router;
