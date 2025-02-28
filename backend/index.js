require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Starting app...");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("Pool created with config:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Initial database connection failed:", err));

pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    ingredients TEXT[],
    instructions TEXT,
    image TEXT,
    nutrition JSONB
  );
  CREATE TABLE IF NOT EXISTS meal_plan (
    day VARCHAR(10) PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id)
  );
`
  )
  .then(() => console.log("Tables created"))
  .catch((err) => console.error("Table creation error:", err));

// Health check
setInterval(() => console.log("Server still alive"), 10000);

// Root endpoint
app.get("/", (req, res) => {
  console.log("GET / endpoint hit");
  res.send("Welcome to Recipe Manager Backend");
});

app.get("/test", (req, res) => {
  console.log("GET /test endpoint hit");
  res.send("Backend is alive!");
});

app.get("/recipes", async (req, res) => {
  console.log("GET /recipes endpoint hit");
  try {
    const result = await pool.query("SELECT * FROM recipes");
    console.log("Recipes fetched:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).send("Server error");
  }
});

app.post("/recipes", async (req, res) => {
  console.log("POST /recipes endpoint hit:", req.body);
  const { title, category, ingredients, instructions, image, nutrition } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO recipes (title, category, ingredients, instructions, image, nutrition) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, category, ingredients, instructions, image, nutrition]
    );
    console.log("Recipe posted:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error posting recipe:", err);
    res.status(500).send("Server error");
  }
});

app.get("/meal-plan", async (req, res) => {
  console.log("GET /meal-plan endpoint hit");
  try {
    const result = await pool.query("SELECT * FROM meal_plan");
    const mealPlan = result.rows.reduce(
      (acc, { day, recipe_id }) => ({ ...acc, [day]: recipe_id }),
      {}
    );
    console.log("Meal plan fetched:", mealPlan);
    res.json(mealPlan);
  } catch (err) {
    console.error("Error fetching meal plan:", err);
    res.status(500).send("Server error");
  }
});

app.post("/meal-plan", async (req, res) => {
  console.log("POST /meal-plan endpoint hit:", req.body);
  const { day, recipeId } = req.body;
  try {
    await pool.query(
      "INSERT INTO meal_plan (day, recipe_id) VALUES ($1, $2) ON CONFLICT (day) DO UPDATE SET recipe_id = $2",
      [day, recipeId]
    );
    console.log("Meal plan updated for day:", day);
    res.status(200).send("Meal plan updated");
  } catch (err) {
    console.error("Error posting meal plan:", err);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on port ${port}`)
);
