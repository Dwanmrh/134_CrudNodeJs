const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Middleware untuk memastikan user telah login
function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.role === "user") {
    return next();
  }
  res.redirect("/login");
}

// Halaman daftar film
router.get("/", isAuthenticated, async (req, res) => {
  const [films] = await db.query("SELECT * FROM films");
  res.render("user/films", { films });
});

// Halaman jadwal berdasarkan film
router.get("/jadwal/:filmId", isAuthenticated, async (req, res) => {
  const { filmId } = req.params;
  const [jadwal] = await db.query(
    "SELECT j.*, f.title FROM jadwal j JOIN films f ON j.film_id = f.id WHERE j.film_id = ?",
    [filmId]
  );
  res.render("user/jadwal", { jadwal });
});

// Halaman pilih kursi
router.get("/kursi/:jadwalId", isAuthenticated, async (req, res) => {
  const { jadwalId } = req.params;
  const [kursi] = await db.query("SELECT * FROM kursi WHERE jadwal_id = ?", [jadwalId]);
  res.render("user/kursi", { kursi, jadwalId });
});

// Proses pemesanan
router.post("/pesan", isAuthenticated, async (req, res) => {
  const { jadwalId, kursiId } = req.body;
  const userId = req.session.user.id;

  try {
    // Mulai transaksi
    const [result] = await db.query(
      "INSERT INTO transaksi (user_id, total_harga, status) VALUES (?, ?, 'pending')",
      [userId, 50000] // Contoh harga tetap, bisa diubah
    );

    const transaksiId = result.insertId;

    // Simpan ke tabel pesanan
    await db.query(
      "INSERT INTO pesanan (transaksi_id, jadwal_id, kursi_id) VALUES (?, ?, ?)",
      [transaksiId, jadwalId, kursiId]
    );

    // Update status kursi jadi "booked"
    await db.query("UPDATE kursi SET status = 'booked' WHERE id = ?", [kursiId]);

    res.redirect(`/user/transaksi/${transaksiId}`);
  } catch (err) {
    console.error(err);
    res.send("Terjadi kesalahan saat memproses pesanan.");
  }
});

// Halaman detail transaksi
router.get("/transaksi/:transaksiId", isAuthenticated, async (req, res) => {
  const { transaksiId } = req.params;

  const [transaksi] = await db.query(
    "SELECT t.*, p.kursi_id, j.waktu, j.tanggal, f.title " +
      "FROM transaksi t " +
      "JOIN pesanan p ON t.id = p.transaksi_id " +
      "JOIN jadwal j ON p.jadwal_id = j.id " +
      "JOIN films f ON j.film_id = f.id " +
      "WHERE t.id = ?",
    [transaksiId]
  );

  if (transaksi.length > 0) {
    res.render("user/transaksi", { transaksi: transaksi[0] });
  } else {
    res.send("Transaksi tidak ditemukan.");
  }
});

module.exports = router;
