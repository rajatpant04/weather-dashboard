import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';

export const SearchBar = forwardRef(({ 
  onSearch, 
  onSelectCity, 
  loading, 
  recentSearches = [],
  favorites = []
}, ref) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setSearching(true);
      onSearch(query, (results) => {
        setSearchResults(results);
        setSearching(false);
      });
    } else {
      setSearchResults([]);
      setSearching(false);
    }
  }, [query, onSearch]);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (query.length >= 2 || recentSearches.length > 0 || favorites.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search city..."
          className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          disabled={loading}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {showDropdown && (searchResults.length > 0 || recentSearches.length > 0 || favorites.length > 0) && (
        <div className="mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden animate-in">
          {favorites.length > 0 && (
            <div className="p-3 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                <FiHeart className="w-4 h-4 text-red-500" />
                Favorites
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {favorites.map((city) => (
                  <button
                    key={`${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/70 text-left transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{city.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="p-3 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                <FiSearch className="w-4 h-4" />
                Search Results
              </div>
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map((city) => (
                  <button
                    key={`${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/70 text-left transition-colors flex items-center gap-3"
                  >
                    <FiMapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {city.admin1}, {city.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recentSearches.length > 0 && searchResults.length === 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                <FiClock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {recentSearches.map((city) => (
                  <button
                    key={`${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/70 text-left transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{city.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && recentSearches.length === 0 && favorites.length === 0 && query.length >= 2 && !searching && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No cities found
            </div>
          )}

          {searching && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchBar;