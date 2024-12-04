const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Koneksi ke database

const Film = sequelize.define('Film', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'films', // Nama tabel di database
  timestamps: false, // Sesuaikan dengan struktur tabel Anda (misal, jika tidak ada `createdAt`, `updatedAt`)
});

module.exports = Film;
