import React, { useEffect, useCallback } from "react";
import "./styles/RecipeModal.css";

const FALLBACK =
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

const RecipeModal = ({ recipe, onClose, isFavourite = false, onToggleFav }) => {
  if (!recipe) return null;

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Trap scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Build ingredients */
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const mea = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ name: ing.trim(), measure: mea ? mea.trim() : "" });
    }
  }

  /* Clean instructions into steps */
  const steps = recipe.strInstructions
    ? recipe.strInstructions
        .split(/(?:\r?\n)+|(?<=\.)\s+(?=[A-Z])/)
        .map((s) => s.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((s) => s.length > 8)
    : [];

  /* YouTube URL */
  const videoUrl =
    recipe.strYoutube && recipe.strYoutube.includes("watch?v=")
      ? recipe.strYoutube
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          recipe.strMeal + " recipe"
        )}`;

  const handleShare = useCallback(async () => {
    const text = `Check out this recipe: ${recipe.strMeal}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.strMeal, text, url: videoUrl });
      } catch (_) {}
    } else {
      navigator.clipboard?.writeText(`${text}\n${videoUrl}`);
      alert("Link copied to clipboard!");
    }
  }, [recipe, videoUrl]);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${recipe.strMeal} recipe details`}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-layout">
          {/* Left: Image */}
          <div className="modal-img-col">
            <img
              src={recipe.strMealThumb || FALLBACK}
              alt={recipe.strMeal}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
            />
            <div className="modal-img-badge">
              {recipe.strCategory && <span>{recipe.strCategory}</span>}
              {recipe.strArea && <span>{recipe.strArea}</span>}
            </div>
          </div>

          {/* Right: Details */}
          <div className="modal-detail-col">
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">{recipe.strMeal}</h2>
              <div className="modal-actions">
                <button
                  className={`modal-action-btn fav-toggle ${isFavourite ? "active" : ""}`}
                  onClick={() => onToggleFav?.(recipe)}
                  aria-label={isFavourite ? "Remove from favourites" : "Save to favourites"}
                  title={isFavourite ? "Remove from favourites" : "Save to favourites"}
                >
                  {isFavourite ? "♥ Saved" : "♡ Save"}
                </button>
                <button
                  className="modal-action-btn share-btn"
                  onClick={handleShare}
                  aria-label="Share recipe"
                  title="Share recipe"
                >
                  ↗ Share
                </button>
              </div>
            </div>

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <section className="modal-section">
                <h3 className="modal-section-title">
                  <span className="section-dot" />
                  Ingredients
                  <span className="ingredient-count">({ingredients.length})</span>
                </h3>
                <ul className="ingredients-grid">
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="ingredient-chip">
                      {item.measure && (
                        <span className="ingredient-measure">{item.measure}</span>
                      )}
                      <span className="ingredient-name">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <section className="modal-section">
                <h3 className="modal-section-title">
                  <span className="section-dot" />
                  Instructions
                </h3>
                <ol className="steps-list">
                  {steps.map((step, idx) => (
                    <li key={idx} className="step-item">
                      <span className="step-num">{idx + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* YouTube */}
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-btn"
              aria-label={`Watch ${recipe.strMeal} recipe video on YouTube`}
            >
              <span className="yt-icon">▶</span>
              Watch Recipe on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;