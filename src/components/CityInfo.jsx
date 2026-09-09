import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';

export const CityInfo = ({ 
  city, 
  lastUpdated, 
  onSearch, 
  onSelectCity, 
  searchResults, 
  isSearching, 
  showCitySelector, 
  clearCitySelector 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResultsLocal, setSearchResultsLocal] = useState([]);
  const [isSearchingLocal, setIsSearchingLocal] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = useCallback((query, callback) => {
    onSearch(query, callback);
  }, [onSearch]);

  const focusSearch = useCallback(() => {
    inputRef.current?.focus();
  }, []);

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
    if (searchResults.length >= 2) {
      setShowDropdown(true);
      setSearchResultsLocal(searchResults);
      setIsSearchingLocal(false);
    } else if (searchResults.length === 1) {
      setShowDropdown(true);
      setSearchResultsLocal(searchResults);
      setIsSearchingLocal(false);
    } else {
      setShowDropdown(false);
      setSearchResultsLocal([]);
      setIsSearchingLocal(false);
    }
  }, [searchResults]);

  const handleSelect = (city) => {
    onSelectCity(city);
    setSearchResultsLocal([]);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const renderLocationHeader = (city) => {
    if (!city) return null;
    
    const admin1 = city.admin1 || '';
    const country = city.country || '';
    const statePart = admin1 ? `, ${admin1}` : '';
    const countryPart = country ? `, ${country}` : '';
    
    return (
      <div className="mb-6 animate-in">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              📍 {city.name}${statePart}${countryPart}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={city ? city.name : ''}
          onChange={(e) => setSearchResultsLocal([])}
          onFocus={focusSearch}
          placeholder="Search city..."
          className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          disabled={isSearchingLocal || !!city}
        />
        {city && (
          <button
            onClick={() => setSearchResultsLocal([])}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {renderLocationHeader(city)}
      
      {showDropdown && (searchResultsLocal.length > 0 || isSearchingLocal) && (
        <div className="mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden animate-in">
          {isSearchingLocal && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          )}

          {searchResultsLocal.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {searchResultsLocal.map((city) => (
                <button
                  key={`${city.latitude}-${city.longitude}`}
                  onClick={() => handleSelect(city)}
                  className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/70 text-left transition-colors flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {city.admin1}, {city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchResultsLocal.length === 0 && !isSearchingLocal && city && city.name && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No cities found
            </div>
          )}

          {isSearchingLocal && (
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
};

export default CityInfo;