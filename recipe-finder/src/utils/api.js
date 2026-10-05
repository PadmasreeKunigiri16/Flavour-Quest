const BASE = "https://www.themealdb.com/api/json/v1/1";

/**
 * Search recipes by name keyword
 */
export const fetchRecipes = async (query = "") => {
  try {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error("fetchRecipes error:", err);
    return [];
  }
};

/**
 * Filter recipes by category (used for the Explore category pills)
 */
export const fetchRecipesByCategory = async (category = "") => {
  try {
    // filter endpoint returns partial data (no instructions), suitable for cards
    const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const meals = data.meals || [];
    // Enrich first 20 results with full details so modal has all fields
    const enriched = await Promise.all(
      meals.slice(0, 20).map(async (m) => {
        try {
          const r = await fetch(`${BASE}/lookup.php?i=${m.idMeal}`);
          const d = await r.json();
          return d.meals?.[0] || m;
        } catch {
          return m;
        }
      })
    );
    return enriched;
  } catch (err) {
    console.error("fetchRecipesByCategory error:", err);
    return [];
  }
};

/**
 * Fetch full recipe detail by id
 */
export const fetchRecipeById = async (id) => {
  try {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.meals?.[0] || null;
  } catch (err) {
    console.error("fetchRecipeById error:", err);
    return null;
  }
};