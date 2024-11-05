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

// Endpoint untuk menambahkan tugas baru
router.post("/", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") {
    return res.status(400).send("Tugas tidak boleh kosong");
  }

  // Cari ID terbesar yang ada di database
  db.query("SELECT MAX(id) AS maxId FROM todos", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");

    // Hitung ID baru secara manual
    const nextId = results[0].maxId ? results[0].maxId + 1 : 1;

    // Insert data dengan ID yang sudah dihitung
    db.query(
      "INSERT INTO todos (id, task) VALUES (?, ?)",
      [nextId, task.trim()],
      (err, insertResults) => {
        if (err) return res.status(500).send("Internal Server Error");
        const newTodo = {
          id: nextId,
          task: task.trim(),
          completed: false,
        };
        res.status(201).json(newTodo);
      }
    );
  });
});

// Endpoint untuk memperbarui tugas
router.put("/:id", (req, res) => {
  const { task, completed } = req.body;

  // Validasi input: Pastikan task adalah string dan completed adalah boolean
  if (typeof task !== "string" || task.trim() === "") {
    return res.status(400).send("Tugas tidak boleh kosong atau tidak valid");
  }

  if (typeof completed !== "boolean") {
    return res.status(400).send("Nilai 'completed' harus berupa boolean");
  }

  db.query(
    "UPDATE todos SET task = ?, complete = ? WHERE id = ?",
    [task.trim(), completed, req.params.id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log error untuk debugging
        return res.status(500).send(`Internal Server Error: ${err.message}`);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Tugas tidak ditemukan");
      }
      res.json({ id: req.params.id, task: task.trim(), completed });
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

module.exports = router;
