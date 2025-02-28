import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://recipe-manager-backend-thomas.herokuapp.com";
const USER_ID = 1; // Hardcoded for demo

const MealPlanner = ({ recipes }) => {
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const fetchMealPlan = async () => {
    try {
      const response = await axios.get(`${API_URL}/meal-plan`, {
        params: { userId: USER_ID },
      });
      setMealPlan(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  const updateMealPlan = async (day, recipeId) => {
    try {
      await axios.post(`${API_URL}/meal-plan`, {
        userId: USER_ID,
        day,
        recipeId,
      });
      setMealPlan({ ...mealPlan, [day]: recipeId });
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
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
      {days.map((day) => (
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
      ))}
    </div>
  );
};

export default MealPlanner;
