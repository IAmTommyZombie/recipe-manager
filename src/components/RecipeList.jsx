import { useState } from "react";

const RecipeList = ({ recipes, onEditRecipe, onDeleteRecipe }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    ingredients: [],
    instructions: [],
    nutrition: {},
  });

  const startEditing = (recipe) => {
    setEditingId(recipe.id);
    setEditForm({
      title: recipe.title,
      category: recipe.category,
      ingredients: recipe.ingredients.join("\n"),
      instructions: recipe.instructions.join("\n"),
      nutrition: Object.entries(recipe.nutrition)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
    });
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    const nutritionObj = editForm.nutrition
      .split("\n")
      .filter((item) => item.trim() !== "")
      .reduce((acc, line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        acc[key] = Number(value) || 0;
        return acc;
      }, {});

    const updatedRecipe = {
      id,
      title: editForm.title,
      category: editForm.category,
      ingredients: editForm.ingredients
        .split("\n")
        .filter((item) => item.trim() !== ""),
      instructions: editForm.instructions
        .split("\n")
        .filter((item) => item.trim() !== ""),
      nutrition: nutritionObj,
    };
    onEditRecipe(updatedRecipe);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Recipes</h3>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes yet—add one above!</p>
      ) : (
        recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white shadow-md rounded-lg p-4">
            {editingId === recipe.id ? (
              <form
                onSubmit={(e) => handleEditSubmit(e, recipe.id)}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Recipe Title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  placeholder="Category"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <textarea
                  value={editForm.ingredients}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ingredients: e.target.value })
                  }
                  placeholder="Ingredients (one per line)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="4"
                />
                <textarea
                  value={editForm.instructions}
                  onChange={(e) =>
                    setEditForm({ ...editForm, instructions: e.target.value })
                  }
                  placeholder="Instructions (one per line)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="4"
                />
                <textarea
                  value={editForm.nutrition}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nutrition: e.target.value })
                  }
                  placeholder="Nutrition (one per line)\ncalories: 500\nprotein: 30\nfat: 20\ncarbs: 40"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="4"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h4 className="text-xl font-medium text-gray-800">
                  {recipe.title}
                </h4>
                <p className="text-gray-600 text-sm">{recipe.category}</p>
                <ul className="text-gray-700 mt-2 list-disc list-inside">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <ol className="text-gray-700 mt-2 list-decimal list-inside">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
                <div className="text-gray-700 mt-2">
                  <p className="font-medium">Nutrition:</p>
                  <ul className="list-none">
                    {Object.entries(recipe.nutrition).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => startEditing(recipe)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeList;
