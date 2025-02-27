// src/components/MealPlanner.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

const MealPlanner = ({ recipes }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/meal-plan`)
      .then((response) => setMealPlan(response.data))
      .catch((error) => console.error("Error fetching meal plan:", error));
  }, []);

  const handleSelect = async (day, recipeId) => {
    const updatedPlan = {
      ...mealPlan,
      [day]: recipeId ? Number(recipeId) : null,
    };
    setMealPlan(updatedPlan);
    await axios.post(`${API_URL}/meal-plan`, {
      day,
      recipeId: recipeId ? Number(recipeId) : null,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Weekly Meal Planner
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{day}</h3>
            <select
              value={mealPlan[day] || ""}
              onChange={(e) => handleSelect(day, e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--paprika-orange)] focus:border-transparent"
            >
              <option value="">No Recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            {mealPlan[day] && (
              <div className="mt-2">
                {recipes.find((r) => r.id === Number(mealPlan[day]))?.image && (
                  <img
                    src={
                      recipes.find((r) => r.id === Number(mealPlan[day])).image
                    }
                    alt="Meal"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
