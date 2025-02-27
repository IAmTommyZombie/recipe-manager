// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/RecipeForm";
import RecipeDetail from "./components/RecipeDetail";
import MealPlanner from "./components/MealPlanner";

const API_URL = "http://localhost:3000"; // Change this later for deployment

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes`);
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const addRecipe = async (newRecipe) => {
    try {
      const response = await axios.post(`${API_URL}/recipes`, newRecipe);
      setRecipes([...recipes, response.data]);
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen flex bg-[var(--paprika-cream)] text-gray-800 font-sans">
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h1 className="text-2xl font-bold text-[var(--paprika-orange)] mb-6">
          Recipe Manager
        </h1>
        <nav className="space-y-2 mb-6">
          <Link
            to="/"
            className="block p-2 bg-[var(--paprika-orange)] text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Recipes
          </Link>
          <Link
            to="/meal-planner"
            className="block p-2 bg-[var(--paprika-orange)] text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Meal Planner
          </Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <RecipeForm onAddRecipe={addRecipe} />
                <RecipeList recipes={recipes} onSelect={selectRecipe} />
              </>
            }
          />
          <Route path="/meal-planner" element={null} />
        </Routes>
      </div>
      <div className="w-3/4">
        <Routes>
          <Route path="/" element={<RecipeDetail recipe={selectedRecipe} />} />
          <Route
            path="/meal-planner"
            element={<MealPlanner recipes={recipes} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
