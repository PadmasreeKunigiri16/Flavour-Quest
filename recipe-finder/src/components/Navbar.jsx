import React, { useState, useCallback } from "react";
import "./styles/Navbar.css";

const Navbar = ({ toggleDarkMode, darkMode, onHomeClick, favCount = 0, onFavClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = useCallback(() => {
    onHomeClick?.();
    setMenuOpen(false);
  }, [onHomeClick]);

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        {/* Logo */}
        <button
          className="logo-btn"
          onClick={handleLogoClick}
          aria-label="Go to home – FlavourQuest"
        >
          <span className="logo-icon">🍜</span>
          <span className="logo-text">
            Flavour<span className="logo-accent">Quest</span>
          </span>
        </button>

        {/* Desktop actions */}
        <nav className="nav-actions" aria-label="Site navigation">
          <button
            className="nav-btn fav-btn"
            onClick={onFavClick}
            aria-label={`Favourites – ${favCount} saved`}
          >
            <span className="fav-icon">♥</span>
            <span className="nav-btn-label">Favourites</span>
            {favCount > 0 && (
              <span className="fav-badge" aria-hidden="true">{favCount}</span>
            )}
          </button>

          <button
            className="nav-btn theme-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-icon" aria-hidden="true">
              {darkMode ? "☀️" : "🌙"}
            </span>
            <span className="nav-btn-label">{darkMode ? "Light" : "Dark"}</span>
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu" role="menu">
          <button className="mobile-menu-item" onClick={() => { onFavClick?.(); setMenuOpen(false); }}>
            ♥ Favourites {favCount > 0 && <span className="fav-badge">{favCount}</span>}
          </button>
          <button className="mobile-menu-item" onClick={() => { toggleDarkMode(); setMenuOpen(false); }}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;