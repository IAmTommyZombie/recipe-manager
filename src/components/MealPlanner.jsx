import { useState, useEffect } from "react";

const MealPlanner = ({ recipes }) => {
  const [mealPlan, setMealPlan] = useState({});
  const [userId, setUserId] = useState(""); // Match App’s userId later

  useEffect(() => {
    if (userId) {
      fetchMealPlan();
    }
  }, [userId]);

  const fetchMealPlan = () => {
    const storedPlan =
      JSON.parse(localStorage.getItem(`mealPlan_${userId}`)) || {};
    setMealPlan(storedPlan);
  };

  const updateMealPlan = (day, recipeId) => {
    const updatedPlan = { ...mealPlan, [day]: recipeId || null };
    localStorage.setItem(`mealPlan_${userId}`, JSON.stringify(updatedPlan));
    setMealPlan(updatedPlan);
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

  return (
    <div>
      <h2>Meal Planner</h2>
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
        days.map((day) => (
          <div key={day}>
            <label>{day}: </label>
            <select
              value={mealPlan[day] || ""}
              onChange={(e) => updateMealPlan(day, e.target.value)}
            >
              <option value="">None</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
          </div>
        ))
      ) : (
        <p>Please enter a User ID to view your meal plan.</p>
      )}
    </div>
  );
};

export default MealPlanner;
