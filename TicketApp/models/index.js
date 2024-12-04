const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Database connection error:", err));

// Models
const User = require("./user")(sequelize);
const Film = require("./film")(sequelize);

module.exports = { sequelize, User, Film };
