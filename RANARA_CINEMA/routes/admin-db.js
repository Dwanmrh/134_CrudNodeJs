const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua Movie
router.get("/", (req, res) => {
  db.query("SELECT * FROM film", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// Endpoint untuk mendapatkan Movie berdasarkan ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM film WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.length === 0)
        return res.status(404).send("Movie Tidak Ditemukan");
      res.json(results[0]);
    }
  );
});

// Endpoint untuk menambahkan Movie baru
router.post("/", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") {
    return res.status(400).send("Movie Tidak Boleh Kosong");
  }

  // Cari ID terbesar yang ada di database
  db.query("SELECT MAX(id) AS maxId FROM film", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");

    // Hitung ID baru secara manual
    const nextId = results[0].maxId ? results[0].maxId + 1 : 1;

    // Insert data dengan ID yang sudah dihitung
    db.query(
      "INSERT INTO film (id, task) VALUES (?, ?)",
      [nextId, task.trim()],
      (err, insertResults) => {
        if (err) return res.status(500).send("Internal Server Error");
        const newMovie = {
          id: nextId,
          task: task.trim(),
          completed: false,
        };
        res.status(201).json(newMovie);
      }
    );
  });
});

// Endpoint untuk memperbarui Movie
router.put("/:id", (req, res) => {
  const { task, completed } = req.body;

  // Validasi input: Pastikan task adalah string dan completed adalah boolean
  if (typeof task !== "string" || task.trim() === "") {
    return res.status(400).send("Movie tidak boleh kosong atau tidak valid");
  }

  if (typeof completed !== "boolean") {
    return res.status(400).send("Movie 'success' harus berupa boolean");
  }

  db.query(
    "UPDATE film SET title = ?, genre = ? WHERE id_film = ?",
    [task.trim(), completed, req.params.id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log error untuk debugging
        return res.status(500).send(`Internal Server Error: ${err.message}`);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Movie tidak ditemukan");
      }
      res.json({ id: req.params.id, task: task.trim(), completed });
    }
  );
});

// Endpoint untuk menghapus Movie
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM film WHERE id_film = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Movie tidak ditemukan");
      res.status(204).send();
    }
  );
});

module.exports = router;