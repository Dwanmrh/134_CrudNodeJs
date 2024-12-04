const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Route Read
router.get("/", adminController.index);
router.get("/movie", adminController.index); // Alias untuk /movie

// Route Create
router.get("/movie/create", adminController.createForm);
router.post("/movie", adminController.store);

// Route Update
router.get("/movie/edit/:id", adminController.edit);
router.put("/movie/:id", adminController.update);

// Route Delete
router.delete("/movie/:id", adminController.delete);

module.exports = router;
