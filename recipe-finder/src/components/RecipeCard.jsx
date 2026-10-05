import React, { useCallback } from "react";
import "./styles/RecipeCard.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

const AREA_FLAGS = {
  Indian: "🇮🇳", Italian: "🇮🇹", Chinese: "🇨🇳", Japanese: "🇯🇵",
  Mexican: "🇲🇽", French: "🇫🇷", Thai: "🇹🇭", American: "🇺🇸",
  British: "🇬🇧", Greek: "🇬🇷", Spanish: "🇪🇸", Turkish: "🇹🇷",
  Moroccan: "🇲🇦", Jamaican: "🇯🇲", Filipino: "🇵🇭", Malaysian: "🇲🇾",
  Egyptian: "🇪🇬", Croatian: "🇭🇷", Dutch: "🇳🇱", Vietnamese: "🇻🇳",
  Canadian: "🇨🇦", Irish: "🇮🇪", Tunisian: "🇹🇳", Uruguayan: "🇺🇾",
  Russian: "🇷🇺", Polish: "🇵🇱", Portuguese: "🇵🇹",
  Andhra: "🇮🇳", Telugu: "🇮🇳",
};

const RecipeCard = ({ recipe, onClick, isFavourite = false, onToggleFav }) => {
  const flag = AREA_FLAGS[recipe.strArea] || "";

  const handleFavClick = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleFav?.(recipe);
    },
    [onToggleFav, recipe]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(recipe);
      }
    },
    [onClick, recipe]
  );

  return (
    <article
      className="recipe-card"
      onClick={() => onClick?.(recipe)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${recipe.strMeal} recipe`}
    >
      {/* Thumbnail */}
      <div className="card-img-wrap">
        <img
          src={recipe.strMealThumb || FALLBACK_IMAGE}
          alt={recipe.strMeal}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        {/* Hover overlay */}
        <div className="card-overlay">
          <span className="card-overlay-text">View Recipe →</span>
        </div>

        {/* Favourite button */}
        <button
          className={`fav-btn-card ${isFavourite ? "active" : ""}`}
          onClick={handleFavClick}
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? "♥" : "♡"}
        </button>
      </div>

      {/* Card body */}
      <div className="card-body">
        <h3 className="card-title">{recipe.strMeal}</h3>
        <div className="card-meta">
          {recipe.strCategory && (
            <span className="card-tag category-tag">{recipe.strCategory}</span>
          )}
          {(recipe.strArea || flag) && (
            <span className="card-tag area-tag">
              {flag} {recipe.strArea}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;