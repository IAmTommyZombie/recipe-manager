import { useState, useEffect } from "react";
import "./App.css";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [userId, setUserId] = useState(""); // User enters this

  useEffect(() => {
    if (userId) {
      fetchRecipes();
    }
  }, [userId]);

  const fetchRecipes = () => {
    const storedRecipes =
      JSON.parse(localStorage.getItem(`recipes_${userId}`)) || [];
    setRecipes(storedRecipes);
  };

  const addRecipe = (recipe) => {
    const newRecipe = { id: Date.now(), ...recipe }; // Simple ID using timestamp
    const updatedRecipes = [...recipes, newRecipe];
    localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  return (
    <div className="App">
      <h1>Recipe Manager</h1>
      <div>
        <label>Enter User ID: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g., user1"
        />
      </div>
      {userId ? (
        <>
          <RecipeForm onAddRecipe={addRecipe} />
          <RecipeList recipes={recipes} />
        </>
      ) : (
        <p>Please enter a User ID to start.</p>
      )}
    </div>
  );
}

export default App;
