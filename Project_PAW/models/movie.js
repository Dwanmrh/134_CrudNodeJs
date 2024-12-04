const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("project_paw", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Movie = sequelize.define(
  "Movie", // Nama model
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "films",
  }
);

module.exports = Movie;