const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",         // Ganti jika MySQL Anda ada di server lain
  user: "root",              // Ganti dengan username MySQL Anda
  password: "",  // Ganti dengan password MySQL Anda
  database: "project_paw",   // Ganti sesuai nama database
});

module.exports = db;
