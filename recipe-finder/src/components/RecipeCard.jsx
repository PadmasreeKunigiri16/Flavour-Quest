import React from "react";
import "./styles/RecipeCard.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={() => onClick && onClick(recipe)}>
      <img
        src={recipe.strMealThumb || FALLBACK_IMAGE}
        alt={recipe.strMeal}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />
      <h3>{recipe.strMeal}</h3>
      <p>{recipe.strCategory}</p>
    </div>
  );
};
export default RecipeCard;