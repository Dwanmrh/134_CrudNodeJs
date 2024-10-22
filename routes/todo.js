const express = require('express');
const router = express.Router();

let todos = [
    { id: 1, task: 'Belajar Node.js', completed: false },
    { id: 2, task: 'Membuat API', completed: false },
];

router.get('/', (req, res) => {
    res.json(todos);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ message: 'Todo tidak ditemukan' });
    }
});

module.exports = router;