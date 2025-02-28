require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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

app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/recipes", async (req, res) => {
  const { title, category, ingredients, instructions, image, nutrition } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO recipes (title, category, ingredients, instructions, image, nutrition) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, category, ingredients, instructions, image, nutrition]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/meal-plan", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM meal_plan");
    res.json(
      result.rows.reduce(
        (acc, { day, recipe_id }) => ({ ...acc, [day]: recipe_id }),
        {}
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/meal-plan", async (req, res) => {
  const { day, recipeId } = req.body;
  try {
    await pool.query(
      "INSERT INTO meal_plan (day, recipe_id) VALUES ($1, $2) ON CONFLICT (day) DO UPDATE SET recipe_id = $2",
      [day, recipeId]
    );
    res.status(200).send("Meal plan updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 3000; // Use Render's PORT or fallback to 3000 locally
app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on port ${port}`)
);
