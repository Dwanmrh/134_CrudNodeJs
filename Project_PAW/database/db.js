const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("project_paw", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = sequelize;

require("dotenv").config();
