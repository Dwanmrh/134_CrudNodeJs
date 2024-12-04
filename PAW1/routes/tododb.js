const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get("/", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(results);
  });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM todos WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.length === 0)
        return res.status(404).send("Tugas tidak ditemukan");
      res.json(results[0]);
    }
  );
});

/// Endpoint untuk menambahkan tugas baru
router.post("/", (req, res) => {
  const { task } = req.body;

  // Cek jika task kosong
  if (!task || task.trim() === "") {
    return res.status(400).send("Tugas tidak boleh kosong");
  }

  // Query untuk menambahkan tugas baru ke database
  db.query(
    "INSERT INTO todos (task, complete) VALUES (?, ?)",
    [task.trim(), false],
    (err, results) => {
      if (err) {
        console.error("Error inserting task:", err); // Log error untuk debugging
        return res.status(500).send("Internal Server Error");
      }

      const newTodo = {
        id: results.insertId, // Dapatkan ID otomatis
        task: task.trim(),
        completed: false,
      };

      // Kembalikan respons dengan data tugas yang baru ditambahkan
      res.status(201).json(newTodo);
    }
  );
});

// Endpoint untuk memperbarui tugas
router.put("/:id", (req, res) => {
  const { task } = req.body;

  if (!task || task.trim() === "") {
    return res.status(400).send("Tugas tidak boleh kosong");
  }

  db.query(
    "UPDATE todos SET task = ? WHERE id = ?",
    [task.trim(), req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Tugas tidak ditemukan");
      res.json({ id: req.params.id, task: task.trim() });
    }
  );
});

// Endpoint untuk menghapus tugas
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM todos WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Tugas tidak ditemukan");
      res.status(204).send();
    }
  );
});

router.post("/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM todos WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Tugas tidak ditemukan");
      res.redirect("/"); // Redirect setelah berhasil menghapus
    }
  );
});

module.exports = router;
