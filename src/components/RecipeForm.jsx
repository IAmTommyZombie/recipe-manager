// src/components/RecipeForm.jsx
import React, { useState } from "react";

const RecipeForm = ({ onAddRecipe }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); // Base64 string
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe({
      id: Date.now(),
      title,
      category,
      ingredients: ingredients.split("\n"),
      instructions,
      image,
    });
    setTitle("");
    setCategory("Dinner");
    setIngredients("");
    setInstructions("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Add a Recipe</h2>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Category:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
        >
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Snack">Snack</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mt-1"
        />
        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-md"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Ingredients (one per line):
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows="5"
          required
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Instructions:
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows="5"
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-[var(--paprika-orange)] text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        Add Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
