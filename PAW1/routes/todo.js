const express = require("express");
const router = express.Router();

// Simulasi data todos
let todos = [
  { id: 1, task: "Belajar Node.js", completed: false },
  { id: 2, task: "Membuat API", completed: false },
];

// GET semua todo
router.get("/", (req, res) => {
  res.json(todos);
});

// POST untuk menambahkan todo baru
router.post("/", (req, res) => {
  const { task } = req.body;

  // Validasi input
  if (!task) {
    return res.status(400).json({ message: "Task tidak boleh kosong" });
  }

  const newTodo = {
    id: todos.length + 1,
    task: task,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// GET todo berdasarkan ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo tidak ditemukan" });
  }
});

// DELETE todo berdasarkan ID
router.delete("/:id", (req, res) => {
  const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));

  // Jika todo tidak ditemukan
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  // Menghapus todo dan mengembalikan data yang dihapus
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res
    .status(200)
    .json({ message: `Tugas'${deletedTodo.task}'berhasil dihapus` });
});

router.put("/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Tugas tidak ditemukan" });
  todo.task = req.body.task || todo.task;

  res.status(200).json({
    message: `Tugas dengan ID ${todo.id} telah diperbarui`,
    updatedTodo: todo,
  });
});

module.exports = router;
