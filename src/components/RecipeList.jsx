// src/components/RecipeList.jsx
import React, { useState } from "react";

const RecipeList = ({ recipes, onSelect }) => {
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

  const filteredRecipes = recipes
    .filter(
      (recipe) => filterCategory === "All" || recipe.category === filterCategory
    )
    .filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Recipes</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search recipes..."
        className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
      />
      <div className="flex justify-between mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
        >
          <option value="All">All Categories</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Snack">Snack</option>
        </select>
        <button
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className="p-2 bg-[var(--paprika-orange)] text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          {viewMode === "list" ? "Grid" : "List"}
        </button>
      </div>
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500 italic">
          No recipes match your search or category.
        </p>
      ) : viewMode === "list" ? (
        <ul className="space-y-2">
          {filteredRecipes.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="p-3 bg-[var(--paprika-cream)] rounded-lg shadow-sm hover:bg-[var(--paprika-orange)] hover:text-white cursor-pointer transition-colors flex items-center"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-12 h-12 object-cover rounded-md mr-3"
                />
              )}
              <div>
                {recipe.title}{" "}
                <span className="text-sm text-gray-600">
                  ({recipe.category})
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="p-3 bg-[var(--paprika-cream)] rounded-lg shadow-sm hover:bg-[var(--paprika-orange)] hover:text-white cursor-pointer transition-colors"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <p>{recipe.title}</p>
              <p className="text-sm text-gray-600">{recipe.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
