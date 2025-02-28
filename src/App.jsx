import { useState, useEffect } from "react";
import "./App.css";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import axios from "axios";

const API_URL = "https://recipe-manager-backend-thomas.herokuapp.com"; // Update after deployment
const USER_ID = 1; // Hardcoded for demo; later, could be dynamic

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes`, {
        params: { userId: USER_ID },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const addRecipe = async (recipe) => {
    try {
      const response = await axios.post(`${API_URL}/recipes`, {
        userId: USER_ID,
        ...recipe,
      });
      setRecipes([...recipes, response.data]);
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <div className="App">
      <h1>Recipe Manager</h1>
      <RecipeForm onAddRecipe={addRecipe} />
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default App;
