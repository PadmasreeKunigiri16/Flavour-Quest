import React, { useState, useCallback } from "react";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const App = () => {
  const [darkMode, setDarkMode]           = useState(false);
  const [resetHome, setResetHome]         = useState(false);
  const [favourites, setFavourites]       = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fq_favourites") || "[]");
    } catch {
      return [];
    }
  });
  const [showFavourites, setShowFavourites] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const handleHomeClick = useCallback(() => {
    setResetHome((p) => !p);
    setShowFavourites(false);
  }, []);

  const handleToggleFav = useCallback((recipe) => {
    setFavourites((prev) => {
      const exists = prev.some((f) => f.idMeal === recipe.idMeal);
      const next = exists
        ? prev.filter((f) => f.idMeal !== recipe.idMeal)
        : [...prev, recipe];
      localStorage.setItem("fq_favourites", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleFavClick = useCallback(() => {
    setShowFavourites((p) => !p);
  }, []);

  return (
    <div>
      <Navbar
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        onHomeClick={handleHomeClick}
        favCount={favourites.length}
        onFavClick={handleFavClick}
      />
      <Home
        resetHome={resetHome}
        favourites={favourites}
        onToggleFav={handleToggleFav}
        showFavourites={showFavourites}
        setShowFavourites={setShowFavourites}
      />
    </div>
  );
};

export default App;