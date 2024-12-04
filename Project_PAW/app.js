const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const methodOverride = require("method-override");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

// Middleware untuk method override
app.use(methodOverride("_method"));

// Setting EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.set("nav", "layouts/nav");

// Routes
const movieRoutes = require("./routes/movieRoutes");
app.use("/", movieRoutes);

app.get("/films", (req, res) => {
  res.redirect("/");
});

const bodyParser = require("body-parser");
const sequelize = require("./database/db");
const Movie = require("./models/movie");

const PORT = process.env.PORT || 3001; // Gunakan port lain jika 3000 sudah digunakan
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.use(bodyParser.json());

(async () => {
  try {
    await sequelize.sync({ force: true }); // Sync database
    console.log("Database connected and synced!");
    app.listen(3000, () =>
      console.log("Server running on http://localhost:3001")
    );
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
})();
