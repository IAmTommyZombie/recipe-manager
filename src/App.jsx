import { useState, useEffect } from "react";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import MealPlanner from "./components/MealPlanner";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [userId, setUserId] = useState(
    localStorage.getItem("recipeUserId") || ""
  );
  const [activeView, setActiveView] = useState("recipes");

  useEffect(() => {
    if (userId) {
      fetchRecipes();
      localStorage.setItem("recipeUserId", userId);
    }
  }, [userId]);

  const fetchRecipes = () => {
    const storedRecipes =
      JSON.parse(localStorage.getItem(`recipes_${userId}`)) || [];
    const normalizedRecipes = storedRecipes.map((recipe) => ({
      ...recipe,
      instructions: Array.isArray(recipe.instructions)
        ? recipe.instructions
        : recipe.instructions.split("\n").filter((item) => item.trim() !== ""),
      nutrition:
        typeof recipe.nutrition === "object" && recipe.nutrition !== null
          ? recipe.nutrition
          : {}, // Default to empty object if missing
    }));
    setRecipes(normalizedRecipes);
  };

  const addRecipe = (recipe) => {
    const newRecipe = { id: Date.now(), ...recipe };
    const updatedRecipes = [...recipes, newRecipe];
    localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  const editRecipe = (updatedRecipe) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    localStorage.setItem(`recipes_${userId}`, JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex">
      <aside className="w-64 bg-red-800 text-white p-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Recipe Manager</h1>
        </div>
        <nav>
          <button
            onClick={() => setActiveView("recipes")}
            className={`w-full text-left py-2 px-4 mb-2 rounded ${
              activeView === "recipes" ? "bg-red-600" : "hover:bg-red-700"
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => setActiveView("mealPlanner")}
            className={`w-full text-left py-2 px-4 rounded ${
              activeView === "mealPlanner" ? "bg-red-600" : "hover:bg-red-700"
            }`}
          >
            Meal Planner
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeView === "recipes" ? "Your Recipes" : "Meal Planner"}
            </h2>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="userId"
                className="text-sm font-medium text-gray-600"
              >
                User ID:
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., user1"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        {userId ? (
          <div className="space-y-6">
            {activeView === "recipes" && (
              <>
                <RecipeForm onAddRecipe={addRecipe} />
                <RecipeList
                  recipes={recipes}
                  onEditRecipe={editRecipe}
                  onDeleteRecipe={deleteRecipe}
                />
              </>
            )}
            {activeView === "mealPlanner" && (
              <MealPlanner recipes={recipes} userId={userId} />
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">
            Enter a User ID to get started!
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
