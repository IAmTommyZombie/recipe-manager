import { useState, useEffect } from "react";

const MealPlanner = ({ recipes, userId }) => {
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    if (userId) {
      fetchMealPlan();
    }
  }, [userId]);

  const fetchMealPlan = () => {
    const storedPlan =
      JSON.parse(localStorage.getItem(`mealPlan_${userId}`)) || {};
    const normalizedPlan = Object.fromEntries(
      days.map((day) => [
        day,
        Array.isArray(storedPlan[day])
          ? storedPlan[day]
          : storedPlan[day]
          ? [storedPlan[day]]
          : [],
      ])
    );
    setMealPlan(normalizedPlan);
  };

  const addMeal = (day) => {
    const updatedPlan = {
      ...mealPlan,
      [day]: [...(mealPlan[day] || []), { type: "Breakfast", recipeId: "" }],
    };
    localStorage.setItem(`mealPlan_${userId}`, JSON.stringify(updatedPlan));
    setMealPlan(updatedPlan);
  };

  const updateMeal = (day, index, field, value) => {
    const updatedMeals = [...mealPlan[day]];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    const updatedPlan = { ...mealPlan, [day]: updatedMeals };
    localStorage.setItem(`mealPlan_${userId}`, JSON.stringify(updatedPlan));
    setMealPlan(updatedPlan);
  };

  const removeMeal = (day, index) => {
    const updatedMeals = mealPlan[day].filter((_, i) => i !== index);
    const updatedPlan = { ...mealPlan, [day]: updatedMeals };
    localStorage.setItem(`mealPlan_${userId}`, JSON.stringify(updatedPlan));
    setMealPlan(updatedPlan);
  };

  const calculateDailyNutrition = (day) => {
    const meals = mealPlan[day] || [];
    return meals.reduce((totals, meal) => {
      const recipe = recipes.find((r) => r.id === Number(meal.recipeId));
      if (!recipe || !recipe.nutrition) return totals;
      Object.entries(recipe.nutrition).forEach(([key, value]) => {
        totals[key] = (totals[key] || 0) + value;
      });
      return totals;
    }, {});
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal Planner</h3>
      <div className="space-y-6">
        {days.map((day) => (
          <div key={day} className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-700">{day}</h4>
              <button
                onClick={() => addMeal(day)}
                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-sm transition"
              >
                + Add Meal
              </button>
            </div>
            {mealPlan[day] && mealPlan[day].length > 0 ? (
              <>
                {mealPlan[day].map((meal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={meal.type}
                      onChange={(e) =>
                        updateMeal(day, index, "type", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      {mealTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={meal.recipeId || ""}
                      onChange={(e) =>
                        updateMeal(day, index, "recipeId", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <option value="">None</option>
                      {recipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeMeal(day, index)}
                      className="bg-gray-400 text-white px-2 py-1 rounded-md hover:bg-gray-500 text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="mt-2 text-gray-700">
                  <p className="font-medium">Daily Nutrition Total:</p>
                  {Object.entries(calculateDailyNutrition(day)).length > 0 ? (
                    <ul className="list-none text-sm">
                      {Object.entries(calculateDailyNutrition(day)).map(
                        ([key, value]) => (
                          <li key={key}>
                            {key}: {value}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No nutrition data yet.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No meals planned yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
