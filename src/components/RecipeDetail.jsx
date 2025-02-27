// src/components/RecipeDetail.jsx
import React from "react";

const RecipeDetail = ({ recipe }) => {
  if (!recipe)
    return (
      <p className="text-gray-500 italic">
        Select a recipe from the list to view details.
      </p>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{recipe.title}</h2>
      <p className="text-gray-600 mb-4">Category: {recipe.category}</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Ingredients:</h3>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-600">
            {ingredient}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Instructions:
      </h3>
      <p className="text-gray-600 whitespace-pre-wrap">
        {recipe.instructions || "No instructions provided."}
      </p>
    </div>
  );
};

export default RecipeDetail;
