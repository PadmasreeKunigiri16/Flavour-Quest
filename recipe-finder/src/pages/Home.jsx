import React, { useState, useEffect, useCallback } from "react";
import { fetchRecipes, fetchRecipesByCategory } from "../utils/api";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";
import RecipeModal from "../components/RecipeModal";
import SearchBar from "../components/SearchBar";
import { andhraRecipes } from "../data/andhraRecipes";
import "./Home.css";

const CATEGORIES = ["All", "Chicken", "Seafood", "Vegetarian", "Dessert", "Pasta", "Beef"];

const Home = ({ resetHome, favourites, onToggleFav, showFavourites, setShowFavourites }) => {
  const [chickenRecipes, setChickenRecipes]   = useState([]);
  const [soupRecipes, setSoupRecipes]         = useState([]);
  const [exploreAll, setExploreAll]           = useState([]);
  const [visibleCount, setVisibleCount]       = useState(12);
  const [loading, setLoading]                 = useState(true);
  const [searchLoading, setSearchLoading]     = useState(false);
  const [selectedRecipe, setSelectedRecipe]   = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");
  const [recipes, setRecipes]                 = useState([]);
  const [activeCategory, setActiveCategory]   = useState("All");
  const [error, setError]                     = useState(null);

  /* Reset on logo click */
  useEffect(() => {
    setSearchQuery("");
    setRecipes([]);
    setShowFavourites(false);
    setActiveCategory("All");
  }, [resetHome]);

  /* Initial data fetch */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [chicken, soup, all] = await Promise.all([
          fetchRecipes("chicken"),
          fetchRecipes("soup"),
          fetchRecipes("a"),
        ]);
        setChickenRecipes(chicken.slice(0, 6));
        setSoupRecipes(soup.slice(0, 6));
        setExploreAll(all);
      } catch (e) {
        setError("Failed to load recipes. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    setShowFavourites(false);
    if (!query.trim()) return;
    setSearchLoading(true);
    setError(null);
    try {
      const apiResults = await fetchRecipes(query);
      const qLower = query.toLowerCase().trim();
      const localResults = andhraRecipes.filter(
        (r) =>
          r.strMeal.toLowerCase().includes(qLower) ||
          (r.strCategory && r.strCategory.toLowerCase().includes(qLower)) ||
          (r.strInstructions && r.strInstructions.toLowerCase().includes(qLower))
      );
      const combined = [
        ...localResults,
        ...apiResults.filter((a) => !localResults.some((l) => l.idMeal === a.idMeal)),
      ];
      setRecipes(combined);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  }, [setShowFavourites]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setRecipes([]);
    setError(null);
  }, []);

  const isFav = (r) => favourites.some((f) => f.idMeal === r.idMeal);

  /* ── Category filter for Explore section ── */
  const handleCategory = useCallback(async (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      const all = await fetchRecipes("a");
      setExploreAll(all);
    } else {
      const results = await fetchRecipesByCategory(cat);
      setExploreAll(results);
    }
    setVisibleCount(12);
  }, []);

  if (loading) return <Loader />;

  /* ── Favourites view ── */
  if (showFavourites) {
    return (
      <main className="home-container">
        <div className="page-hero fav-hero">
          <h1>Your Favourites ♥</h1>
          <p>{favourites.length} saved recipe{favourites.length !== 1 ? "s" : ""}</p>
        </div>
        {favourites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <h3>No favourites yet</h3>
            <p>Click the ♡ on any recipe card to save it here.</p>
            <button className="cta-btn" onClick={() => setShowFavourites(false)}>
              Browse Recipes
            </button>
          </div>
        ) : (
          <div className="section">
            <div className="recipe-grid">
              {favourites.map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={true}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          </div>
        )}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            isFavourite={isFav(selectedRecipe)}
            onToggleFav={onToggleFav}
          />
        )}
      </main>
    );
  }

  return (
    <main className="home-container">
      {/* Hero */}
      {!searchQuery && (
        <section className="page-hero" aria-label="Site introduction">
          <h1 className="hero-title">Discover <span className="hero-accent">Delicious</span> Recipes</h1>
          <p className="hero-sub">Search from thousands of recipes worldwide 🌍</p>
        </section>
      )}

      <SearchBar onSearch={handleSearch} onClear={clearSearch} />

      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Search results */}
      {searchQuery ? (
        <section className="section" aria-label="Search results">
          <h2 className="section-heading">
            {searchLoading ? "Searching…" : `Results for "${searchQuery}"`}
            {!searchLoading && (
              <span className="result-count">{recipes.length} found</span>
            )}
          </h2>
          {searchLoading ? (
            <div className="inline-loader"><div className="spinner" /></div>
          ) : recipes.length > 0 ? (
            <div className="recipe-grid">
              {recipes.map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={isFav(r)}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No recipes found</h3>
              <p>Try a different keyword like "chicken", "pasta", or "curry"</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Chicken */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">🍗 Chicken Recipes</h2>
            </div>
            <div className="recipe-grid">
              {chickenRecipes.map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={isFav(r)}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          </section>

          {/* Soups */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">🥣 Soups & Stews</h2>
            </div>
            <div className="recipe-grid">
              {soupRecipes.map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={isFav(r)}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          </section>

          {/* Andhra */}
          <section className="section andhra-section">
            <div className="section-header">
              <h2 className="section-heading">🌶️ Andhra Pradesh Recipes</h2>
              <p className="section-sub">Authentic Telugu cuisine — spicy, tangy & full of flavour</p>
            </div>
            <div className="recipe-grid">
              {andhraRecipes.map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={isFav(r)}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
          </section>

          {/* Explore All with category filter */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">🌍 Explore All Recipes</h2>
            </div>
            <div className="category-filter" role="tablist" aria-label="Filter by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => handleCategory(cat)}
                  role="tab"
                  aria-selected={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="recipe-grid">
              {exploreAll.slice(0, visibleCount).map((r) => (
                <RecipeCard
                  key={r.idMeal}
                  recipe={r}
                  onClick={setSelectedRecipe}
                  isFavourite={isFav(r)}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>
            {visibleCount < exploreAll.length && (
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((p) => p + 12)}
              >
                Load More Recipes ↓
              </button>
            )}
          </section>
        </>
      )}

      {/* Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavourite={isFav(selectedRecipe)}
          onToggleFav={onToggleFav}
        />
      )}
    </main>
  );
};

export default Home;