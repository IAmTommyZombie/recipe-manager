// src/App.jsx
import React, { useState, useEffect } from "react";
import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/RecipeForm";
import RecipeDetail from "./components/RecipeDetail";

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem("recipes");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen flex bg-[var(--paprika-cream)] text-gray-800 font-sans">
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h1 className="text-2xl font-bold text-[var(--paprika-orange)] mb-6">
          Paprika Clone
        </h1>
        <RecipeForm onAddRecipe={addRecipe} />
        <RecipeList recipes={recipes} onSelect={selectRecipe} />
      </div>
      <div className="w-3/4 p-8">
        <RecipeDetail recipe={selectedRecipe} />
      </div>
    </div>
  );
}

export default App;
