import { useState } from "react";

const RecipeForm = ({ onAddRecipe }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [nutrition, setNutrition] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsArray = ingredients
      .split("\n")
      .filter((item) => item.trim() !== "");
    const instructionsArray = instructions
      .split("\n")
      .filter((item) => item.trim() !== "");
    // Parse nutrition into an object
    const nutritionObj = nutrition
      .split("\n")
      .filter((item) => item.trim() !== "")
      .reduce((acc, line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        acc[key] = Number(value) || 0; // Convert to number, default to 0 if NaN
        return acc;
      }, {});

    onAddRecipe({
      title,
      category,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      nutrition: nutritionObj,
    });
    setTitle("");
    setCategory("");
    setIngredients("");
    setInstructions("");
    setNutrition("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Recipe</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g., Dinner)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (one per line)\n2lbs chicken\n1 can beans\n3 yellow onions"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          rows="4"
        />
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions (one per line)\nPreheat oven to 375°F\nSeason chicken\nBake for 45 minutes"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          rows="4"
        />
        <textarea
          value={nutrition}
          onChange={(e) => setNutrition(e.target.value)}
          placeholder="Nutrition (one per line)\ncalories: 500\nprotein: 30\nfat: 20\ncarbs: 40"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          rows="4"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
