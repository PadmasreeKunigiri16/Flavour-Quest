import React, { useState, useEffect, useRef } from "react";
import "./styles/SearchBar.css";

const SUGGESTIONS = [
  "Chicken Tikka", "Biryani", "Pasta", "Pizza", "Sushi",
  "Butter Chicken", "Dal Makhani", "Paneer", "Tacos", "Ramen",
  "Pad Thai", "Gulab Jamun", "Tiramisu", "Fish Curry",
];

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  /* Ctrl/Cmd + K focuses the input */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      const filtered = SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSuggestions([]);
    onSearch(trimmed);
  };

  const pickSuggestion = (s) => {
    setQuery(s);
    setSuggestions([]);
    onSearch(s);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="search-wrapper" role="search">
      <form onSubmit={handleSubmit} className="search-bar">
        <span className="search-icon" aria-hidden="true">🔍</span>

        <input
          ref={inputRef}
          id="recipe-search"
          className="search-input"
          type="text"
          placeholder="Search recipes… (Ctrl+K)"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          autoComplete="off"
          aria-label="Search for recipes"
          aria-autocomplete="list"
        />

        {query && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        <button type="submit" className="search-submit" aria-label="Search">
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {focused && suggestions.length > 0 && (
        <ul className="suggestions-list" role="listbox" aria-label="Suggestions">
          {suggestions.map((s) => (
            <li
              key={s}
              role="option"
              className="suggestion-item"
              onMouseDown={() => pickSuggestion(s)}
            >
              <span className="suggestion-icon">🍴</span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;